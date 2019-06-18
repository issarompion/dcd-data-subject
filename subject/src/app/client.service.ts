import { Injectable } from "@angular/core";
import { Observable, throwError, } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
  
} from "@angular/common/http";

import { catchError, map } from "rxjs/operators";


const httpOptions = {
  headers: new HttpHeaders({ 
  'Authorization' : 'Bearer '+'token',
   'Content-Type': 'application/json',
   'Access-Control-Allow-Origin': '*',
   'responseType': 'application/json',
   'Access-Control-Allow-Credentials': 'true'
  }),
  //params: new HttpParams().set('test', 'test')
};

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private token:string;
  constructor(private http: HttpClient) { 
    console.log('service create again')
  }
  //.env

  public setToken(token:string){
    this.token = token
  }

  public getToken(){
    console.log('gettoken')
    return this.token
  }

  /**
   * Function to handle error when the server return an error
   *
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code. The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError(error);
  }

  /**
   * Function to extract the data when the server return some
   *
   * @param res
   */
  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  
  public getData(url:string): Observable<any> {
    // Call the http GET
    return this.http.get(url, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
}

// Call the http post
public postData(url:string,data: {}): Observable<any> {
  return this.http.post(url,data,httpOptions).pipe(
    map(this.extractData),
    catchError(this.handleError)
  );
}


}

