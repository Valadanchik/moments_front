import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch  } from '@fortawesome/free-solid-svg-icons'

class Loader extends Component {
    
    constructor(props) {
        super();
    }

    render() {

        if ( this.props.isLoading ) {
            
            return (
                <div className="loader"> 
                    <FontAwesomeIcon icon={faCircleNotch} color='#333' size='3x'spin  />
                </div>
            );

        } else {
            return;
        }
    }
}

export default Loader; // Don’t forget to use export default!

/*import * as React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { shuffle } from "lodash";

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300
};

export const Example = () => {
  const [colors, setColors] = useState(initialColors);

  useEffect(() => {
    setTimeout(() => setColors(shuffle(colors)), 1000);
  }, [colors]);

  return (
    <ul>
      {colors.map(background => (
        <motion.li
          key={background}
          layoutTransition={spring}
          style={{ background }}
        />
      ))}
    </ul>
  );
};

const initialColors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF"];*/
