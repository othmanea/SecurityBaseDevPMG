import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import { faTwitter } from '@fortawesome/free-brands-svg-icons';

// Add an icon to the library for convenient access in other components

// library.add(fas);
library.add(fas, far);
library.add(faTwitter);

const MODULES = [
FontAwesomeModule,
];

@NgModule({
    imports: MODULES,
    exports: MODULES,
    declarations: [],
})

export class FontAweSomeModule {}
