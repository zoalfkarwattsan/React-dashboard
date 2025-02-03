import React, { Component } from 'react'
import Color from "color"

class ColoredLabel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: props.text ?? '',
            color: props.color ?? 'grey',
            opacity: 0.1
        }
    }

    render() {
        const { text, color, opacity } = this.state
        const background = Color(color).alpha(opacity).rgb()
        return (
            <span className={'text-nowrap small mr-25 mt-25'} style={{
              backgroundColor: background,
              color,
              borderRadius: 10,
              padding: 5
            }}>
              {text}
            </span>
            // <div style={{ background, color }}>
            //     {text}
            // </div>
        )
    }
}

export default ColoredLabel