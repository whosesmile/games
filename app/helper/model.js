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
  logging: logger.debug
});

// 代理方法
function wrapfn(Proxy) {
  return {
    get: function (id) {
      return Proxy.findOne({
        where: {
          id: id,
        }
      }).then(function (data) {
        if (data === null) {
          return Promise.reject('not found');
        }
        return data;
      });
    },

    save: function (data) {
      if (data.id) {
        return Proxy.update(data, {
          where: {
            id: data.id
          }
        });
      }
      return Proxy.create(data);
    },

    delete: function (id) {
      return this.save({
        id: id,
        deleted: true
      });
    },

    random: function (size, clause) {
      clause = clause || {};
      return Proxy.findAll({
        offset: 0,
        limit: size || 3,
        order: [Sequelize.fn('RAND'), ],
        where: Object.assign({
          deleted: false,
        }, clause.where)
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
        order: clause.order || [
          ['sort', 'desc'],
          ['id', 'desc'],
        ],
        where: Object.assign({
          deleted: false,
        }, clause.where),
      }).then(function (data) {
        return {
          list: data.rows,
          count: data.count,
          page: page,
          size: size,
        };
      });
    },

    find: function (clause) {
      return Proxy.findAll({
        where: Object.assign({
          deleted: false,
        }, clause.where)
      });
    }
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
  status: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否禁用',
  },
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

// 手游类型
var Type = sequelize.define('type', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
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
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
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
    allowNull: false,
    comment: '横幅',
  },
  style: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '风格：MORPG',
  },
  size: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '下载包大小',
  },
  brief: {
    type: Sequelize.STRING,
    allowNull: false,
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
    comment: '评分',
  },
  tag: {
    type: Sequelize.STRING,
    comment: '推广标签',
  },
  label: {
    type: Sequelize.STRING,
    allowNull: false,
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
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否删除',
  },
});

// 推荐
var Banner = sequelize.define('banner', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '名称',
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '图片',
  },
  link: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '地址',
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
  deleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否删除',
  },
});

// one to many
Type.hasMany(Game, {
  as: 'games'
})

// 如果单独运行 则重建表结构
if (require.main === module) {
  // Type.sync({
  //   force: true
  // });
  // Game.sync({
  //   force: true
  // });
  // Admin.sync({
  //   force: true
  // });
  // Admin.create({
  //   account: 'legend',
  //   password: 'b0c0572d84aa96ed48a5f4c5bad18a17358c07f7f7fd349474edd6e3b8798ed520b0dc8d6b6c8a1f886df0a90ad769419fdbb17a0684c1f6963b9ad9e8a16f84'
  // });
  // Banner.sync({
  //   force: true
  // });
}

exports.model = {
  Type: Type,
  Game: Game,
  Banner: Banner,
  Admin: Admin,
};

exports.proxy = {
  type: wrapfn(Type),
  game: wrapfn(Game),
  admin: wrapfn(Admin),
  banner: wrapfn(Banner),
};
