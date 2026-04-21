import RenDeptTree from './ren-dept-tree.vue';
import CopyButton from './CopyButton.vue';

export function registerGlobComp(app) {
  app.component('RenDeptTree', RenDeptTree);
  app.component('CopyButton', CopyButton);
}