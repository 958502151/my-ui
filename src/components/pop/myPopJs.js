import vue from 'vue';
import myPop from './myPop';

// 创建实例
const MYPOP = vue.extend(myPop);
// 通知节点
const myPopWarp = document.createElement('view');
document.body.appendChild(myPopWarp);

const myMsg = {
  /**
   * @message 信息;
   * @title 标题;
   */
  mypop: ({
    show,
    message,
    title,
    color,
    btnName,
  }) => {
    const MYPOPDOM = new MYPOP({
      el: document.createElement('view'),
      data() {
        return {
          message,
          show: show || true,
          title,
          color: color || '#5DBD85',
          btnName: btnName || '确定',
        };
      },
    });
    myPopWarp.appendChild(MYPOPDOM.$el);
  },
};

function register() {
  vue.prototype.$myMsg = myMsg;
}

export default {
  myMsg,
  register,
};
