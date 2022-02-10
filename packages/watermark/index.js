import Watermark from './src/watermark';

Watermark.install = (Vue) => {
  Vue.component(Watermark.name, Watermark);
};

export default Watermark;