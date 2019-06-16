import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redirection',
  templateUrl: './redirection.component.html',
  styleUrls: ['./redirection.component.css']
})
export class RedirectionComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  connect() {
    //this.router.navigate(['subject'])
    console.log('eeey')
    //.env
    window.location.href='http://localhost:8080/subject';
  }

}
