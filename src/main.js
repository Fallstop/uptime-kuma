import "bootstrap";
import {Tooltip} from "bootstrap";
import { createApp, h } from "vue";
import contenteditable from "vue-contenteditable";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from "./App.vue";
import "./assets/app.scss";
import { i18n } from "./i18n";
import { FontAwesomeIcon } from "./icon.js";
import datetime from "./mixins/datetime";
import mobile from "./mixins/mobile";
import publicMixin from "./mixins/public";
import socket from "./mixins/socket";
import theme from "./mixins/theme";
import { router } from "./router";
import { appName } from "./util.ts";

const app = createApp({
    mixins: [
        socket,
        theme,
        mobile,
        datetime,
        publicMixin,
    ],
    data() {
        return {
            appName: appName
        };
    },
    render: () => h(App),
});

app.use(router);
app.use(i18n);

const options = {
    position: "bottom-right",
};

app.use(Toast, options);
app.component("Editable", contenteditable);
app.component("FontAwesomeIcon", FontAwesomeIcon);

app.mount("#app");

// Expose the vue instance for development
if (process.env.NODE_ENV === "development") {
    console.log("Dev Only: window.app is the vue instance");
    window.app = app._instance;
}

app.directive('tooltip', {
    beforeMount: function bsTooltipCreate(el, binding) {
      let trigger;
      if (binding.modifiers.focus || binding.modifiers.hover || binding.modifiers.click) {
        const t = [];
        if (binding.modifiers.focus) t.push('focus');
        if (binding.modifiers.hover) t.push('hover');
        if (binding.modifiers.click) t.push('click');
        trigger = t.join(' ');
      }
      let opts = {
        title: binding.value,
        placement: binding.arg,
        trigger: trigger,
        html: binding.modifiers.html
      }
      new Tooltip(el,JSON.parse(JSON.stringify(opts)))
    },
    updated: function bsTooltipUpdate(el, binding) {
      const tooltip = Tooltip.getInstance(el)
      if (tooltip._config.title !== binding.value) {
        console.log("yes",tooltip,binding)

        tooltip._config.title = binding.value

        Tooltip.getInstance(el).update();
      }

    },
    unmounted(el, binding) {
      Tooltip.getInstance(el).dispose();
    },
  });
