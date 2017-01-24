import * as React from 'react';

import { Pricing } from './Pricing';
import { LicensePreview } from './LicensePreview';
import { LicenseType } from './LicenseType';

export interface StepLicenseData {
  readonly licenseType: string;
  readonly pricing: any;
}

export interface StepLicenseProps {
  readonly onSubmit: (stepRegisterData: StepLicenseData) => void;
}

export class StepLicense extends React.Component<StepLicenseProps, StepLicenseData> {
  private readonly controls: {
    licenseType?: LicenseType,
    pricing?: Pricing;
    licensePreview?: LicensePreview;
  } = {};

  render() {
    return (
      <section className="step-2-license">
        <h2>Add a License</h2>
        <div className="row">
          <div className="col-sm-6">
            <h3>License</h3>
            <LicenseType
              ref={ licenseType => this.controls.licenseType = licenseType}
              onSelectionChange={this.onLicenseTypeSelectionChange.bind(this)} />
            <Pricing ref={ pricing => this.controls.pricing = pricing } />
          </div>
          <LicensePreview ref={ licensePreview => this.controls.licensePreview = licensePreview } className="col-sm-6"/>
        </div>
        <button className="btn btn-primary" onClick={this.submit.bind(this)}>Next</button>
      </section>
    )
  }

  private submit(): void {
    this.props.onSubmit({
      licenseType: this.controls.licenseType.getSelectedLicenseType(),
      pricing: this.controls.pricing.state
    });
  }

  private onLicenseTypeSelectionChange(id: string, text: string) {
    this.controls.licensePreview.setLicenseType(text);
  }
}