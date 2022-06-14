import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
// import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatFormFieldModule } from "@angular/material/form-field";
// import { MatRadioModule } from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDividerModule} from '@angular/material/divider';
import { MatNativeDateModule } from "@angular/material/core";
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';


const MATERIAL = [
  MatButtonModule, MatIconModule,
  MatInputModule,MatSelectModule,
  MatFormFieldModule,MatToolbarModule,
  MatDatepickerModule, MatDividerModule,
  MatNativeDateModule, MatCardModule,
  MatTooltipModule,MatMenuModule,
  MatSnackBarModule
];

@NgModule({
  imports: MATERIAL,
  exports: MATERIAL
  })
export class MaterialModule{}
