import { Injectable } from '@angular/core';
import Dexie from "dexie";
import { Friend, FriendDisplayInfo, PaidGrp } from './friend.model';

@Injectable({
  providedIn: 'root'
})
export class DexieDbService extends Dexie{

  friends!: Dexie.Table<FriendDisplayInfo, string> // the generic data types specify the type of the object (Friend) and the type of the primary key (string).

  constructor() {
    super('BillSplitterNested-db') //database name
    this.version(1).stores({
      friends : "friendName" //friendName as primaryKey for table named "friends"
    })
    this.friends = this.table("friends")
    this.onAdd()

  }


  async onAdd(){
    await this.friends.add( {
      friendName:"jon",
      totalpaid : 100,
      paidStr: "sdfsd",
      numStr:"4564"
    })
  }


}
