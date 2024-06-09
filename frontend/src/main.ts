import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from './environments/environment';
import {enableProdMode} from "@angular/core";
import {AppModule} from "./app/modules/root/app.module";
import {registerLicense} from "@syncfusion/ej2-base";

registerLicense("Ngo9BigBOggjHTQxAR8/V1NBaF1cWmhOYVdpR2Nbe05zflVOallWVBYiSV9jS3pTcEVnWHpcdnVSRmheVw==")
if (environment.production) {
  enableProdMode();
}


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
