import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import { ListItemNode, ListNode } from "@lexical/list";
import ToolbarPlugin from "@/LexicalPlugin/ToolbarPlugin";
import PlaygroundTheme from "./themes/PlaygroundTheme";
import "./editer.less"
import { observer } from 'mobx-react'
import ButtonToolPlugin from "@/pages/article/ButtonToolPlugin";
import { Popup } from "antd-mobile";
import store from "./store";
import NoteTemplate from "./template";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const editorConfig = {
  namespace: 'suixue-editer',
  theme: PlaygroundTheme,
  onError(error: any) {
    throw error;
  },
  nodes: [ListNode, ListItemNode]
};


function Editor() {
  const { title, show_template } = store;
  return (
    <div className='article-check'>

      <LexicalComposer initialConfig={editorConfig}>
        <div className='editor-container'>
          <ToolbarPlugin />
          <RichTextPlugin
            contentEditable={<ContentEditable className='editor-input' />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ListPlugin />
          <HistoryPlugin />
          <CheckListPlugin />
        </div>
        <ButtonToolPlugin />
        <Popup visible={show_template} position='right' style={{ height: '100%' }} >
          <NoteTemplate />
        </Popup>
      </LexicalComposer>
    </div>
  );
}

function Placeholder() {
  return (
    <div className='editor-placeholder'>
      请输入笔记内容
    </div>
  );
}

export default observer(Editor)