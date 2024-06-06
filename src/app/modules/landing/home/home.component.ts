import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector     : 'landing-home',
    templateUrl  : './home.component.html',
    styleUrls: ['./home.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatButtonModule, RouterLink, MatIconModule],
})
export class LandingHomeComponent
{
    isMenuOpen = false;

    /**
     * Constructor
     */
    constructor()
    {
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }
}
