import { makeAutoObservable, runInAction } from 'mobx';
import MintFilter from 'mint-filter'

class EmployeeResignStore {
  formated_text?: string = '';
  editerHtml: string = '1';
  title: string = '';
  editer_str: string = '';
  show_template: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }
}

export async function getMint() {
  const sensitive = await import(/* webpackChunkName: "sensitiveJson" */ '@/static/sensitive.json')
  return {
    normal_mint: new MintFilter(sensitive.normal),
    makeups_mint: new MintFilter(sensitive.makeups),
    medical_mint: new MintFilter(sensitive.medical)
  }
}


export default new EmployeeResignStore();

