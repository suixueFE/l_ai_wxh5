import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { useState, useEffect, Children } from "react";
import { $selectAll } from '@lexical/selection';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND
} from "@lexical/list";
import {
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
  $setSelection,
  $getTextContent,
  $getRoot
} from 'lexical';
import { Button, Dialog, Input } from "antd-mobile";
import './index.less'
import store from "@/pages/article/store";
import { observer } from "mobx-react";
import { LeftOutline, RightOutline } from "antd-mobile-icons";


export default observer(function ToolbarPlugin(props: { children?: any; }) {
  const { children } = props
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<any>("paragraph");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [dialogShow, setDialogShow] = useState(false)

  const editAritcle = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $selectAll(selection);
        let currentIndex = 0
        selection?.getNodes().forEach((node) => {
          if (node?.getType() === "paragraph" && node?.getTextContent()?.trim()) {
            currentIndex++

            if (currentIndex > 1) {
              const insertNode = $createParagraphNode()
              const insertText = $createTextNode().setTextContent(store.formated_text || ' ')
              insertNode.append(insertText)
              node?.insertBefore(insertNode)
            }
          }
        });
        $setSelection(null);
      }
    });
    setDialogShow(false)
  };


  useEffect(() => {
    const removeUpdateListener = editor.registerTextContentListener(
      (text_content) => {

        store.editer_str = text_content?.replace(/\n\n/g, "\n")
        editor.registerCommand<boolean>(
          CAN_UNDO_COMMAND,
          (payload) => {
            setCanUndo(payload);
            return false;
          },
          COMMAND_PRIORITY_CRITICAL)
        editor.registerCommand<boolean>(
          CAN_REDO_COMMAND,
          (payload) => {
            setCanRedo(payload);
            return false;
          },
          COMMAND_PRIORITY_CRITICAL,
        )
      },
    )
    return removeUpdateListener;
  }, [editor]);

  const formatList = (listType: string) => {
    console.log(blockType);
    if (listType === "number" && blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      setBlockType("number");
    } else if (listType === "bullet" && blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      setBlockType("bullet");
    } else if (listType === "check" && blockType !== "check") {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
      setBlockType("check");
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      setBlockType("paragraph");
    }
  };

  return (
    <div className='toolbar'>
      {/* <Dialog
        title="格式化"
        content={(<>
          <Input onChange={val => { store.formated_text = val }} placeholder='请输入段落分割符' />
          此功能会将输入的段落分隔符<br />插入到每个段落的上面一行
        </>)}
        
        visible={dialogShow}
        onClose={() => setDialogShow(false)}
        onConfirm={editAritcle}
        confirmText={("确认")}
        onCancel={() => setDialogShow(false)}
      /> */}
      <Button
        size='small'
        fill='none'
        color='default'
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        aria-label='Undo'
      >
        <LeftOutline />
      </Button>
      <Button
        size='small'
        fill='none'
        color='default'
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        aria-label='Redo'>
        <RightOutline />
      </Button>
      <Button
        size='small'
        fill='none'
        color='default'
        onClick={() => Dialog.confirm({
          title: '格式化',
          content: (<>
            <Input onChange={val => { store.formated_text = val }} placeholder='请输入段落分割符' />
            此功能会将输入的段落分隔符<br />插入到每个段落的上面一行
          </>),
          onConfirm: () => {
            editAritcle()
          },
        })}
        aria-label='formte'
      >
        格式化
      </Button>
      {children}
      {/* <Button  
        size="mini" 
        variant="outlined" 
        color="default"
        onClick={() => formatList("bullet")}
      >
        Bullet List
      </Button>
      <Button  
        size="mini" 
        variant="outlined" 
        color="default"
        onClick={() => formatList("number")}
      >
        Numbered List
      </Button>
      <Button  
        size="mini" 
        variant="outlined" 
        color="default"
        onClick={() => formatList("check")}
      >
        Check List
      </Button> */}
    </div >
  );
})
