import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import  {registerGlobComp} from './components/register.js';

const app = createApp(App)
app.use(router)
app.mount('#app')
  app.use(ElementPlus);
registerGlobComp(app);