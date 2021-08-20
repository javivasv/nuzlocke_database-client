import Vue from "vue";
import Vuetify from "vuetify/lib";
import "vuetify/dist/vuetify.min.css";
import "vuetify/src/styles/main.sass";

Vue.use(Vuetify);

export default new Vuetify({
  theme: { disable: true },
  icons: {
    iconfont: "fa"
  }
});
