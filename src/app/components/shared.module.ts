import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [TopbarComponent, SidebarComponent],
  imports: [CommonModule, RouterModule],
  exports: [TopbarComponent, SidebarComponent],
})
export class SharedModule {}
