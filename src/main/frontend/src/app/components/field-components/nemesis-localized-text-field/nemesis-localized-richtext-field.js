import React from 'react';
import Translate from 'react-translate-component';
import NemesisLocalizedTextField from './nemesis-localized-text-field';
import { componentRequire } from '../../../utils/require-util';
import { Editor } from '@tinymce/tinymce-react';
import './nemesis-localized-richtext-field.css';
let HtmlEditor = componentRequire('app/custom-components/html-editor/html-editor', 'html-editor');

export default class NemesisTextField extends NemesisLocalizedTextField {
  constructor(props, context) {
    super(props, context);
  }

  getDialogInputField(language, index) {
    return (
      <div key={index} style={{marginBottom: '20px'}}>
        <Translate component="label" content={'main.' + language.labelCode} fallback={language.labelCode} />
        <Editor
            apiKey="pmqdr31g3vkb9glmtnlkegq4jkxxw7b7rd98pv0sa10eyjml"
            className="test"
            initialValue={this.getTextFieldValue(language.value)}
            init={{height: 500,  menubar: false, plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen textcolor',
                'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo fullscreen| formatselect link image| bold italic backcolor forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code'
            }}
            onEditorChange={(value) => this.onTextChange(null, value, language.value)}
        />
      </div>
    )
  }

  getOpenDialogIconClass() {
    return 'fa fa-code entity-navigation-icon';
  }

  getModalSize() {
    return 'large';
  }
}
