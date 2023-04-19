import React from 'react';
import { Button } from "antd-mobile"


function IconButton(props: { [x: string]: any; icon: any; children: any; }) {
  const { icon, children, ...rest } = props
  // const { formated_text, text, title, show_template } = store;

  return (
    <Button fill='none' color="default" {...rest}>
      <div>
        <p style={{ marginBottom: '4px' }}>{icon}</p>
        {children}
      </div>
    </Button>
  );
}
export default IconButton

