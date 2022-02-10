import Watermark from '../packages/watermark';

const components = [
    Watermark,
];

function install(Vue, opts = {}) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });

  Vue.use(directives);
  Vue.use(filters);

  Vue.prototype.$mg = {
    size: opts.size || '',
    border: opts.border,
  };

  Vue.prototype.$mgLANGS = opts.langs || [
    {
      label: '中',
      value: 'zh-CN',
    },
    {
      label: 'En',
      value: 'en-US',
    },
  ];

  Vue.prototype.$download = Download;
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  version: '0.1.2',
  install,
  Watermark,
};
