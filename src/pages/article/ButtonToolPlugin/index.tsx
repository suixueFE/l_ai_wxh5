import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { useState, useEffect, Children, useCallback } from "react";
import { $selectAll } from '@lexical/selection';

import {
  $createTextNode,
  $getRoot,
  $getSelection,
  $getTextContent,
  $isRangeSelection,
  $setSelection,
  TextNode
} from 'lexical';
import { Button, Grid, Toast } from "antd-mobile";
import store, { getMint } from "@/pages/article/store";
import { observer } from "mobx-react";
import IconButton from "@/components/IconButton";
import { TextOutline, FileOutline, ExclamationTriangleOutline } from "antd-mobile-icons";
import throttle from "lodash/throttle";
import ClipboardJS from "clipboard";
import "./index.less"

export default observer(
  function ToolbarPlugin() {
    const { editer_str, title } = store;
    const [editor] = useLexicalComposerContext();
    const handleCopyTitle = useCallback(throttle((e) => {
      if (!title) {
        Toast.show({
          icon: 'fail',
          content: '标题未输入',
        })
        return
      }
      var clipboard = new ClipboardJS('#red-title-btn', {
        text: function () {
          return title
        }
      })

      clipboard.on('success', e => {
        Toast.show({
          icon: 'success',
          content: '复制成功！',
        })

        //  释放内存
        clipboard.destroy()
      })

      clipboard.on('error', e => {

        // 不支持复制
        Toast.show({
          icon: 'fail',
          content: '当前环境不支持复制',
        })

        clipboard.destroy()
      })
    }, 1000, { trailing: true }), [title])

    const handleCopyText = useCallback(throttle((e) => {
      if (!editer_str) {
        Toast.show({
          icon: 'fail',
          content: '笔记正文未输入',
        })
        return
      }
      var clipboard = new ClipboardJS('#red-text-btn', {
        text: function () {
          const matches = [...editer_str.matchAll(/\n/g)];
          let newStr = matches.reduce((acc, pos, currentIndex) => {
            const prevIndex = matches?.[currentIndex - 1]?.index || 0
            // const nextIndex = matches?.[currentIndex + 1 ]?.index
            const index = pos?.index
            if (index) {
              const currentStr = editer_str.slice(prevIndex, index)
              if ((index - 1) === prevIndex) {
                return `${acc}${currentStr} `
              }

              return `${acc}${currentStr}`
            }
            return acc
          }, '');

          newStr = `${newStr}${editer_str.slice(matches[matches.length - 1]?.index, editer_str.length)}`

          return newStr
        }
      })

      clipboard.on('success', e => {
        Toast.show({
          icon: 'success',
          content: '复制成功！',
        })

        //  释放内存
        clipboard.destroy()
      })

      clipboard.on('error', e => {

        // 不支持复制
        Toast.show({
          icon: 'fail',
          content: '当前环境不支持复制',
        })

        clipboard.destroy()
      })
    }, 1500, { trailing: true }), [editer_str])


    const filterText = useCallback(throttle(async (e) => {
      const { normal_mint } = await getMint()
      editor.update(() => {
        function getNewtextNode(wordsArr: string[], node: TextNode, textContent: string) {
          if (wordsArr?.length) {
            let indexs: number[] = []
            wordsArr?.forEach(word => {
              if (word?.length) {
                const len = word?.length
                if (len) {
                  const index = textContent.indexOf(word);
                  console.log(word, index, index + len);
                  indexs = [...indexs, index, index + len]
                }
              }
            })
            const arr = node.splitText(...indexs)
            arr?.forEach(element => {
              if (element?.getTextContent() && wordsArr?.indexOf(element?.getTextContent()) !== -1) {
                element.setStyle('color:red')
              }
            })
          }

        }
        const rootNode = $getRoot();
        const textNodes = rootNode.getAllTextNodes()
        textNodes.forEach((node) => {
          const textContent = node.getTextContent();
          if (textContent) {
            const _normal = normal_mint.filter(textContent)
            getNewtextNode(_normal?.words, node, textContent)
          }
        });

      })
    }, 1000, { trailing: true }), [editor])



    return (
      <>
        <div className='bottom-buttons'>
          <Grid columns={4} className='p16'>
            <Grid.Item span={1}>
              <IconButton
                id='red-title-btn'
                data-clipboard-text={title}
                onClick={handleCopyTitle} icon={<TextOutline />}
              ><span className='icon-btn-text'>复制标题</span></IconButton>
            </Grid.Item>
            <Grid.Item span={1}>
              <IconButton
                id='red-text-btn'
                onClick={handleCopyText} icon={<FileOutline />}
              ><span className='icon-btn-text'>复制正文</span></IconButton>
            </Grid.Item>
            <Grid.Item span={1}>
              <IconButton
                onClick={filterText} icon={<ExclamationTriangleOutline />}
              ><span className='icon-btn-text'>检测</span></IconButton>
            </Grid.Item>
            <Grid.Item span={1}>
              <Button style={{ width: '100%' }} shape='rounded' disabled color='primary'>
                预览
              </Button>
            </Grid.Item>
          </Grid>
        </div>
      </>

    );
  })
