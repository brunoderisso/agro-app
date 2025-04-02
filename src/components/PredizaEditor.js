import React, { useState, useEffect } from 'react';
import RichTextEditor from 'react-rte';
import { withStyles } from "@material-ui/core/styles";


const styles = {
    styles:{
        height: "36vh",
        borderRadius: "20px!important",
    },
    editorStyles:{
        overflow: "auto",
        maxHeight: "20vh",
        
    }
}

export default withStyles(styles)(function PredizaEditor(props) {

    const [value, setValue] = useState(RichTextEditor.createEmptyValue());


    const { classes } = props;

    useEffect(() => {
        if (props.value !== null && props.value !== undefined) {
            setValue(RichTextEditor.createValueFromString(props.value, "html"));
        } else {
            setValue(RichTextEditor.createEmptyValue());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChange = (value) => {
        setValue(value);

        if (typeof props.onChange === "function") {

            props.onChange(
                value.toString('html')
            );
        }
    }


    return (
        <RichTextEditor
            value={value}
            onChange={onChange}
            className={classes.styles}
            editorClassName={classes.editorStyles}
        />
    );

})