//环境参数
process.env.PORT = 80;
process.env.NODE_ENV = 'development';
//process.env.NODE_ENV = 'test';
//process.env.NODE_ENV = 'production';


//全局静态变量
require('./globalVariable');

//数据库配置
exports.database = {
  development: {
    db:  {
      adapter: 'postgres',
      opts:    {
        username: 'postgres',
        password: '73372028',
        database: 'gcontact',
        port:     5432
      }
    },
    app: {
      name: 'development model'
    }
  },

  test: {
    db:  {
      adapter: 'mysql',
      opts:    {
        username: 'root',
        password: '73372028',
        database: 'test',
        port:     3306
      }
    },
    app: {
      name: 'test model'
    }
  },

  product: {
    db:  {
      adapter: 'mysql',
      opts:    {
        username: 'root',
        password: '73372028',
        database: 'gcontact',
        port:     3306
      }
    },
    app: {
      name: 'product model'
    }
  }
};


