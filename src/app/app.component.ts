import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
// import { DexieDbService } from './dexie-db.service'
import { Subscription } from 'rxjs';
import { PaidGrp, Friend, FriendDisplayInfo } from './friend.model';
import { LocalstorageService } from './localstorage.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy  {
  title = 'ngBillSplit';

  billForm !: FormGroup;
  totalBill = 0;
  individualBill = 0;
  isSubmitted = false;
  formChange !: Subscription;
  friendsInfo : Friend[] = [];
  friendsDisplay : FriendDisplayInfo[] = []
  storedData !: Friend[];


  constructor(
    private fb : FormBuilder,
    private _snackBar: MatSnackBar,
    private localStorageDb : LocalstorageService
    ){}


  ngOnInit(): void {
    this.storedData = this.localStorageDb.getData()
    if (this.storedData==[]){
      this.billForm = this.fb.group({
        friends : this.fb.array([
          this.fb.group({
            friendName : ["",Validators.required],
            extraPaidGrp : this.fb.array([
              this.fb.group({
                place: ["",[Validators.required,Validators.minLength(3)]],
                paidAmt : [0,[Validators.min(0),Validators.required],],
                comment : ""
              })
            ])
          })
        ])
      })
    }
    else{
      this.billForm = this.fb.group({});
      let friendGrp = this.fb.array([]);
      this.storedData.forEach((friend) => {
        let paymentGrp = this.fb.array([]);
        friend.extraPaidGrp.forEach( p =>{
          paymentGrp.push( this.fb.group({
            place: [p.place,[Validators.required,Validators.minLength(3)]],
            paidAmt : [p.paidAmt,[Validators.min(0),Validators.required],],
            comment : p.comment
            })
          )
        })
        friendGrp.push( this.fb.group({
          friendName : [friend.friendName,Validators.required],
          extraPaidGrp : paymentGrp
        }) )
      })
      this.billForm = this.fb.group({
        friends : friendGrp
      })
    }
    this.onChange();
    this.onCopy();
  }


  onChange():void{
    this.formChange = this.billForm.valueChanges.subscribe( (val) =>{
      this.onSubmit();
    })
  }

  ngOnDestroy(): void {
      this.formChange.unsubscribe();
  }


  get friends(){
    return this.billForm.controls["friends"] as FormArray;
  }

  extraPaidGrp(friendindex:number){
    return this.friends.at(friendindex).get("extraPaidGrp") as FormArray;
  }

  newExtraPaidGrp():FormGroup{
    return this.fb.group({
      place: ["",[Validators.required,Validators.minLength(3)]],
      paidAmt :[0,Validators.required],
      comment :[""]
    })
  }

  onAddFriend(){
    const friend = this.fb.group({
      friendName : ["",Validators.required],
      extraPaidGrp : this.fb.array([
        this.fb.group({
          place: ["",[Validators.required,Validators.minLength(3)]],
          paidAmt : [0,[Validators.min(0),Validators.required],],
          comment : ""
        })
      ])
    })
    this.friends.push(friend)
  }

  onDeleteFriend(i:number){
    this.friends.removeAt(i);
  }


  onAddExtraPaidGrp(friendindex:number){
    console.log(friendindex)
    this.extraPaidGrp(friendindex).push(this.newExtraPaidGrp());
  }

  onDeleteExtraPaidGrp(friendindex:number,paidindex:number){
    console.log(friendindex)
    this.extraPaidGrp(friendindex).removeAt(paidindex);
  }

  submitTrue(){
    this.isSubmitted = true
  }


  onSubmit(){
    this.totalBill = 0
    this.individualBill = 0
    this.friendsInfo = []
    this.friendsDisplay = []
    this.billForm.value["friends"].forEach( (e: Friend) => {
      this.friendsInfo.push(e);
    })
    this.friendsInfo.forEach( (f : Friend) =>{
      f.extraPaidGrp.forEach( (p : PaidGrp) => {
        this.totalBill = this.totalBill + p.paidAmt;
      })
    });
    this.individualBill = this.totalBill /  this.friendsInfo.length;
    this.friendCost(this.friendsInfo,this.friendsDisplay  );
    this.localStorageDb.saveData(this.friendsInfo);
  }

  onCopy(){
    this.onSubmit()
    let header = "Bill"
    let friendPayment = ""
    let individualPay = ""
    for (let friend of this.friendsDisplay){
      if (friend.totalpaid>0){
        friendPayment = friendPayment
                        + friend.friendName
                        + " paid\n"
                        +  friend.paidStr
                        + "\n\n"
        individualPay = individualPay
                        + friend.friendName
                        + " Bill ="
                        + friend.numStr.substring(1)
                        + "- $"
                        + this.numberWithCommas( this.roundNumber(this.individualBill) )
                        + " = $"
                        + this.numberWithCommas( this.roundNumber(friend.totalpaid-this.individualBill) )
                        + "\n"
      }
      else{
        individualPay = individualPay
                        + friend.friendName
                        + " Bill ="
                        + "- $"
                        + this.numberWithCommas( this.roundNumber(this.individualBill) )
                        + "\n"
      }
    }
    let totalPayment = "Total Bill = $" + this.numberWithCommas(this.totalBill)
    let website = "Generated from https://ys8610.github.io/NgBillSplitNestFormArray/"

    const copyString = header + "\n\n"
                      + friendPayment
                      + totalPayment + "\n\n"
                      + individualPay
                      + "\n" + website

    navigator.clipboard.writeText(copyString)
      .then( (sucess) =>{
        console.log("copy successfully");
      },
      (error) =>{
        console.log("copy failed");
      });

      this._snackBar.open("copied to clipboard", "close" ,{duration: 4000} );
  }

  onReset(){
    this.billForm = this.emptyForm();
    this.localStorageDb.saveData([]);
    this.totalBill = 0
    this.individualBill = 0
    this.friendsInfo = []
    this.friendsDisplay = []
    this.onCopy();
    window.location.reload();
  }


  private roundNumber(num: number){
    return Math.round((num + Number.EPSILON) * 100) / 100
  }

  private numberWithCommas(num : number) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  private friendCost ( b : Friend[] , c:FriendDisplayInfo[] ){
    b.forEach( (f : Friend)=>{
      let tempF = <FriendDisplayInfo>{}
      tempF.totalpaid = 0
      tempF.paidStr = ""
      tempF.numStr = ""
      tempF.friendName = f.friendName
      console.log(f.friendName)
      f.extraPaidGrp.forEach( (p : PaidGrp)=>{
        tempF.totalpaid = tempF.totalpaid+ p.paidAmt
      })
      if ( tempF.totalpaid>0){
        f.extraPaidGrp.forEach( (p : PaidGrp)=>{
          if (p.paidAmt>0){
            tempF.paidStr =  tempF.paidStr + "$" + this.numberWithCommas(p.paidAmt) + " @" + p.place + " for " + p.comment + "\n"
            tempF.numStr = tempF.numStr + "+ $" + p.paidAmt + " "
          }
        })
      }
      c.push(tempF)
    })
  }

  private emptyForm(){
    this.billForm = this.fb.group({
      friends : this.fb.array([
        this.fb.group({
          friendName : ["",Validators.required],
          extraPaidGrp : this.fb.array([
            this.fb.group({
              place: ["",[Validators.required,Validators.minLength(3)]],
              paidAmt : [0,[Validators.min(0),Validators.required],],
              comment : ""
            })
          ])
        })
      ])
    })
    return this.billForm;
  }

}
