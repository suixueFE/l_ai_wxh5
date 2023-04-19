import React from 'react';
import { Grid, Button, Card } from "antd-mobile"
import { CloseOutline } from "antd-mobile-icons"
import { observer } from 'mobx-react'
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import store from '../store';

// import './index.less'
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';

const fixed_templates = [
  {
    group: '个人',
    notes: [
      {
        title: '前端每日一题——',
        text: ` `,
      }

    ]
  },
  {
    group: '好物',
    notes: [
      {
        title: '可爱好物分享',
        text: `今天又是给大家带来可爱好物的一天~
💙 
迪士尼米老鼠耳机
小耳朵姐妹的福音！

💙 
XX吹风机
高颜值+环保材料，双倍快乐

💙
复古手链
天上星变成钻石，跌落在一片湛蓝湖海
ㅤ
关注我，解锁更多好物哦~
`,

      },
      {
        title: '今日高颜值家居分享',
        text:
          `🌟 来分享一组最近买到的高颜值好物，让家里变得更温馨~
🍁 
🍂 
🍁 
🍂 
🍁 
ㅤ
🌿 让小细节点缀生活，让我们的生活更幸福~
`,
      }

    ]
  },
]
function NoteTemplate() {
  // const { formated_text, text, title, show_template } = store;
  const [editor] = useLexicalComposerContext();

  const setArticleByNote = (note: { title: any; text: any; }) => {
    store.title = note.title

    editor.update(() => {
      // editor.clear()
      const rootNode = $getRoot();
      rootNode.clear()
      const insertNode = $createParagraphNode()
      const insertText = $createTextNode().setTextContent(note.text || ' ')
      insertNode.append(insertText)
      rootNode.append(insertNode)

      // const selection = $getSelection();
      // if ($isRangeSelection(selection)) {
      //   $selectAll(selection);
      //   selection?.getNodes().forEach((node) => {
      //     if (node?.getType() === "paragraph" && node?.getTextContent()) {
      //       const insertNode = $createParagraphNode()
      //       const insertText = $createTextNode().setTextContent(store.formated_text || ' ')
      //       insertNode.append(insertText)
      //       node?.insertBefore(insertNode)
      //     }
      //   });
      //   $setSelection(null);
      // }
    });
    store.show_template = false
  };
  return (
    <div className='note_template'>
      <Button fill='none' color='default' onClick={() => store.show_template = false}> <CloseOutline /> </Button>
      {fixed_templates.map(template => {
        return <Card key={template.group} title={template?.group} >
          {template?.notes?.map(note => {
            return <div key={note.title} className='note_part'>
              <Grid columns={3} gap={8}>
                <Grid.Item className='note_title' span={2}>{note.title}</Grid.Item>
                <Grid.Item span={1}>
                  <Button fill='none' color='primary'
                    onClick={() => setArticleByNote(note)}
                  >使用</Button>
                </Grid.Item>
              </Grid>

              <div className='note_text' >
                {note.text}
              </div>
            </div>
          })}

        </Card>
      })}

    </div>


  );
}
export default observer(NoteTemplate)

