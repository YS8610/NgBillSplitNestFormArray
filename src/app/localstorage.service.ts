import { Injectable } from '@angular/core';
import { Friend } from './friend.model';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  saveData(friends:Friend[]):void{
    localStorage.setItem("BillSplitterNested",JSON.stringify(friends));
  }

  getData():Friend[]{
    let jsonStr = localStorage.getItem("BillSplitterNested");
    if (jsonStr!=null){
      let jsonObj = JSON.parse(jsonStr);
      return <Friend[]>jsonObj;
    }
    return [];
  }

  is_Exist():boolean{
    return localStorage.getItem('BillSplitterNested') != null?true:false;
  }
}
