var config = require('../config');
var Sequelize = require('sequelize');
var logger = require('./logger');

// 初始化数据库
var sequelize = new Sequelize(config.database.dbname, config.database.username, config.database.password, {
  host: config.database.host,
  port: config.database.port,
  dialect: config.database.dialect,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: logger.debug,
  timezone: '+08:00',
});

// 代理方法
function wrapfn(Proxy) {
  return {
    get: function (id) {
      return Proxy.findOne({
        where: {
          id: id,
        },
        include: [{
          all: true
        }],
      }).then(function (data) {
        if (data === null) {
          return Promise.reject('not found');
        }
        return data;
      });
    },

    save: function (data) {
      var self = this;
      if (typeof data.save === 'function') {
        return data.save();
      }
      if (data.id) {
        return Proxy.update(data, {
          where: {
            id: data.id
          }
        }).then(function () {
          return self.get(data.id);
        });
      }
      return Proxy.create(data);
    },

    delete: function (id) {
      return this.get(id).then(function (instance) {
        return instance.destroy();
      });
    },

    random: function (size, clause) {
      clause = clause || {};
      return Proxy.findAll({
        offset: 0,
        limit: size || 3,
        order: [Sequelize.fn('RAND'), ],
        where: clause.where
      });
    },

    list: function (page, size, clause) {
      page = parseInt(page || 1, 10);
      size = parseInt(size || 20, 10);
      clause = clause || {};
      return Proxy.findAndCountAll({
        attributes: {
          exclude: ['password', 'describe']
        },
        offset: size * (page - 1),
        limit: size,
        include: clause.include || [],
        order: clause.order || [
          ['sort', 'desc'],
          ['id', 'desc'],
        ],
        where: clause.where,
      }).then(function (data) {
        return {
          list: data.rows,
          count: data.count,
          page: page,
          size: size,
          nums: Math.floor((data.count - 1) / size + 1),
        };
      });
    },

    find: function (clause) {
      return Proxy.findAll({
        where: clause.where
      });
    },

    all: function () {
      return this.find({
        where: {
          id: {
            $gt: 0
          }
        }
      });
    },
  };
}

// 管理员
var Admin = sequelize.define('admin', {
  account: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    comment: '账户',
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '密码',
  },
  sort: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '排序规则',
  },
  status: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否禁用',
  },
}, {
  paranoid: true,
});

// 手游
var Game = sequelize.define('game', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '名称',
  },
  logo: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '图标',
  },
  banner: {
    type: Sequelize.STRING,
    allowNull: true,
    comment: '横幅',
  },
  size: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '100.0',
    comment: '下载包大小',
  },
  brief: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '暂未填写',
    comment: '简介',
  },
  describe: {
    type: Sequelize.TEXT,
    allowNull: false,
    comment: '描述',
  },
  score: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 4,
    comment: '评分',
  },
  tag: {
    type: Sequelize.STRING,
    comment: '推广标签',
  },
  label: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '精彩纷呈 等你来战 传奇你我 游戏人生',
    comment: '描述标签',
  },
  pictures: {
    type: Sequelize.TEXT,
    allowNull: false,
    comment: '图库',
    get: function () {
      return JSON.parse(this.getDataValue('pictures') || null);
    },
    set: function (data) {
      this.setDataValue('pictures', JSON.stringify(data));
    },
  },
  ratio: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: '充值比例',
  },
  sort: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '排序规则',
  },
  android: {
    type: Sequelize.STRING,
    allowNull: true,
    comment: '安卓下载',
  },
  iphone: {
    type: Sequelize.STRING,
    allowNull: true,
    comment: '苹果下载',
  },
  status: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否上架',
  },
  remark: {
    type: Sequelize.STRING,
    allowNull: true,
    comment: '备注信息',
  },
}, {
  paranoid: true,
  initialAutoIncrement: 1001
});

// 推荐
var Banner = sequelize.define('banner', {
  game: {
    type: Sequelize.TEXT,
    allowNull: false,
    comment: '推荐游戏',
    get: function () {
      return JSON.parse(this.getDataValue('game') || null);
    },
    set: function (data) {
      this.setDataValue('game', JSON.stringify(data));
    },
  },
  summary: {
    type: Sequelize.TEXT,
    allowNull: false,
    comment: '描述',
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '图片',
  },
  place: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '位置',
  },
  sort: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '排序',
  },
  status: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否上架',
  },
}, {
  paranoid: true,
});

// 手游类别 (联网 单机 破解 变态 ...)
var Category = sequelize.define('category', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  sort: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '排序规则',
  },
}, {
  paranoid: true,
});

// 手游类型 (角色 动作 棋牌 策略 休闲 ...)
var Type = sequelize.define('type', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  logo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  sort: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '排序规则',
  },
}, {
  paranoid: true,
});

// 手游题材 (魔幻 三国 西游 仙侠 武侠 ...)
var Theme = sequelize.define('theme', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  sort: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '排序规则',
  },
}, {
  paranoid: true,
});

// one to many
Type.hasMany(Game, {
  as: 'games'
});

// one to many
Theme.hasMany(Game, {
  as: 'games'
});

// many to many
Category.belongsToMany(Game, {
  through: 'games_categories'
});
Game.belongsToMany(Category, {
  through: 'games_categories'
});

exports.model = {
  Type: Type,
  Game: Game,
  Theme: Theme,
  Banner: Banner,
  Admin: Admin,
  Category: Category,
};

exports.proxy = {
  type: wrapfn(Type),
  theme: wrapfn(Theme),
  game: wrapfn(Game),
  admin: wrapfn(Admin),
  banner: wrapfn(Banner),
  category: wrapfn(Category),
};

// 如果单独运行 则重建表结构
if (require.main === module) {
  sequelize.sync({
    force: true
  }).then(function () {
    // 管理员
    Admin.create({
      account: 'legend',
      password: 'b0c0572d84aa96ed48a5f4c5bad18a17358c07f7f7fd349474edd6e3b8798ed520b0dc8d6b6c8a1f886df0a90ad769419fdbb17a0684c1f6963b9ad9e8a16f84',
      status: true,
    });

    // 游戏分类
    var categories = ['联网', '单机', '破解', '变态'];
    categories.forEach(function (name, index) {
      Category.create({
        name: name,
        sort: categories.length - index
      });
    });

    // 游戏题材
    var themes = ['魔幻', '三国', '西游', '仙侠', '武侠', '历史', '战争', '体育', 'RPG', '3D', '卡牌', '策略', '动作', '经营', '跑酷', '都市', '放置', '其它'];
    themes.forEach(function (name, index) {
      Theme.create({
        name: name,
        sort: themes.length - index
      });
    });

    // 游戏类型
    var types = ['角色扮演', '动作格斗', '休闲益智', '棋牌天地', '策略冒险', '飞行射击', '模拟养成', '卡牌对战', '塔防游戏', '赛车竞速', '其他'];
    types.forEach(function (name, index) {
      Type.create({
        name: name,
        logo: '/assets/images/' + (index + 1) + '.png',
        sort: types.length - index
      });
    });
  });
}
