import React from 'react';
import { Input, Form, NavBar } from "antd-mobile"
import { observer } from 'mobx-react'
import store from './store';

import ArticleEditer from '@/pages/article/Editer'

import './index.less'



function Index() {
  const { title, show_template } = store;
  return (
    <div className='text-edit'>
      <NavBar>笔记编辑</NavBar>
      <Form.Item
        extra={20 - title.length}>
        <Input
          value={title}
          maxLength={20}
          className='red-text-title'
          onChange={val => {
            store.title = val
          }}
          placeholder='请输入标题' />
      </Form.Item>
      <ArticleEditer />
    </div>

  );
}
export default observer(Index)

