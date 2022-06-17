import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { paidGrp, friend, friendDisplayInfo } from './friend.model';


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
  friendsInfo : friend[] = [];
  friendsDisplay : friendDisplayInfo[] = []


  constructor(private fb : FormBuilder, private _snackBar: MatSnackBar){}


  ngOnInit(): void {
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
    this.onChange();
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
    this.billForm.value["friends"].forEach( (e: friend) => {
      this.friendsInfo.push(e)
    })
    this.friendsInfo.forEach( (f : friend) =>{
      f.extraPaidGrp.forEach( (p : paidGrp) => {
        this.totalBill = this.totalBill + p.paidAmt
      })
    });
    this.individualBill = this.totalBill /  this.friendsInfo.length
    this.friendCost(this.friendsInfo,this.friendsDisplay  )
  }

  onCopy(){
    this.onSubmit()
    let header = "Bill"
    let friendPayment = ""
    let paymentPart1 = ""
    let paymentPart2 = "Bill = "
    let paymentPart3 = "= $" + this.numberWithCommas(this.totalBill)
    let paymentPart4 = ""
    let website = "Generated from https://ys8610.github.io/ngBillSplit/"
    this.friendsInfo.forEach( (f : friend) =>{
      f.extraPaidGrp.forEach( (p : paidGrp) => {
        friendPayment = friendPayment + "$" +  p.paidAmt + " @" + p.place + " (" + p.comment + ")\n"
      })
      paymentPart1 = paymentPart1 + f.friendName + " paid \n" + friendPayment
      friendPayment = ""
      console.log(paymentPart1)

    })

    const copyString = header + "\n\n"
                      + paymentPart1
                      + "\n" + paymentPart2.substring(0,paymentPart2.length-1)
                      + "\n" + paymentPart3 + "\n"
                      + "\n" + paymentPart4
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


  private roundNumber(num: number){
    return Math.round((num + Number.EPSILON) * 100) / 100
  }

  private numberWithCommas(num : number) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  private friendCost ( b : friend[] , c:friendDisplayInfo[] ){
    b.forEach( (f : friend)=>{
      let tempF = <friendDisplayInfo>{}
      tempF.totalpaid = 0
      tempF.paidStr = ""
      tempF.numStr = ""
      tempF.friendName = f.friendName
      console.log(f.friendName)
      f.extraPaidGrp.forEach( (p : paidGrp)=>{
        tempF.totalpaid = tempF.totalpaid+ p.paidAmt
      })
      if ( tempF.totalpaid>0){
        f.extraPaidGrp.forEach( (p : paidGrp)=>{
          tempF.paidStr =  tempF.paidStr + "$" + this.numberWithCommas(p.paidAmt) + " @" + p.place + " for " + p.comment + "\n"
          tempF.numStr = tempF.numStr + "+" + p.paidAmt
        })
      }
      c.push(tempF)
    })
  }
}
