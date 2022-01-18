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
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                    ],
                    image_list:this.getImageList(),
                    textcolor_cols: "3",
                    textcolor_rows: "3",
                    colors: [
                        "333300", "Dark olive",
                    ],
                    toolbar: 'undo redo fullscreen| formatselect link image| bold italic backcolor forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code'
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
                    if (el.name) {
                        title += "(" + el.name + ")";
                    }
                    res.push({title : title, value: el.previewUrl});
                }
            }
        })
        .catch(err => {
            console.log(err);
        })
    return res;
  }

  getOpenDialogIconClass() {
    return 'fa fa-code entity-navigation-icon';
  }

  getModalSize() {
    return 'large';
  }
}
