import React, { useRef, useState } from 'react';
import Translate from 'react-translate-component';
import NemesisLocalizedTextField from './nemesis-localized-text-field';
import { componentRequire } from '../../../utils/require-util';
import ApiCall from '../../../services/api-call';
import { Editor } from '@tinymce/tinymce-react';
import './nemesis-localized-richtext-field.css';
let HtmlEditor = componentRequire('app/custom-components/html-editor/html-editor', 'html-editor');

export default class NemesisTextField extends NemesisLocalizedTextField {
  constructor(props, context) {
    super(props, context);
    this.state = {...this.state, tinyMCEKey: context.markupConfig.tinyMCEKey};
  }

  getDialogInputField(language, index) {
    return (
      <div key={index} style={{marginBottom: '20px'}}>
        <Translate component="label" content={'main.' + language.labelCode} fallback={language.labelCode} />
        {this.state.tinyMCEKey ?
            <Editor
                apiKey={this.state.tinyMCEKey}
                className="test"
                value={this.getTextFieldValue(language.value)}
                init={{height: 400,  menubar: true, plugins: [
                    'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons'
                    ],
                    quickbars_insert_toolbar: false,
                    toolbar_mode: 'wrap',
                    verify_html: false,
                    force_br_newlines : false,
                    force_p_newlines : false,
                    apply_source_formatting : true,
                    branding: false,
                    image_list:this.getImageList(),
                    color_cols: "3",
                    color_map: this.getColorMap(),
                    menubar: 'file edit view insert format tools table help',
                    toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl'
                }}
                onEditorChange={(value) => this.onTextChange(null, value, language.value)}
            />
        : <HtmlEditor htmlContent={this.getTextFieldValue(language.value)} onChange={(value) => this.onTextChange(null, value, language.value)} />
        }
      </div>
    )
  }

  getImageList() {
    let res = [];
    ApiCall.get(`media`)
        .then(result => {
            if (result.data && result.data._embedded && result.data._embedded.mediaEntities) {
                for (var i=0; i < result.data._embedded.mediaEntities.length; i++) {
                    let el = result.data._embedded.mediaEntities[i];
                    let title = el.code;
                    let val = el.previewUrl;
                    if (el.name) {
                        title += "(" + el.name + ")";
                    }
                    if (!val) {
                        val = "";
                    }

                    res.push({title : title, value: val});
                }
            }
        })
        .catch(err => {
            console.log(err);
        })
    return res;
  }

  getColorMap() {
    return [
           '000000', 'Primary',
           '808080', 'Secondary',
           'FFFFFF', 'Light',
           'FF0000', 'Dark',
           'FFFF00', 'Muted',
           '008000', 'Success',
           '008000', 'Info',
           '0000FF', 'Danger',
           '0000FF', 'Warning',
           '0000FF', 'White'
    ];
  }

  getOpenDialogIconClass() {
    return 'fa fa-code entity-navigation-icon';
  }

  getModalSize() {
    return 'large';
  }
}
