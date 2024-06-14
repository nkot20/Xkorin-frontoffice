import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {CategoryService} from "../../../core/category/category.service";
import {Observable} from "rxjs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Category} from "../../../core/category/category.types";

@Component({
  selector: 'app-choose-profil',
  templateUrl: './choose-profil.component.html',
  styleUrls: ['./choose-profil.component.scss'],
    standalone: true,
    imports: [RouterLink, AsyncPipe, NgForOf, NgIf]
})
export class ChooseProfilComponent implements OnInit{

    categories$: Observable<Category[]>;
    category: Category;
    error: boolean = false;

    constructor(private categoryService: CategoryService, private router: Router) {

    }


    ngOnInit(): void {
        this.categories$ = this.categoryService.categories$;
    }

    onChangeCategory(category) {
        this.error = true;
        this.category = category;
    }

    onGo() {
        localStorage.setItem('smfjskflsssf5489oop', this.category._id);
        this.router.navigate(['/sign-up'])
    }

}
