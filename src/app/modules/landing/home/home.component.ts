import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {NgClass} from "@angular/common";

@Component({
    selector     : 'landing-home',
    templateUrl  : './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports: [MatButtonModule, RouterLink, MatIconModule, NgClass],
})
export class LandingHomeComponent implements OnInit
{
    isMenuOpen = false;

    /**
     * Constructor
     */
    constructor()
    {
    }

    ngOnInit() {
        document.addEventListener('DOMContentLoaded', function() {
            const menuButton = document.querySelector('[data-collapse-toggle]');
            const menu = document.getElementById('navbar-default');

            menuButton.addEventListener('click', function() {
                if (menu.classList.contains('hidden')) {
                    menu.classList.remove('hidden');
                } else {
                    menu.classList.add('hidden');
                }
            });
        });


    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }
}
