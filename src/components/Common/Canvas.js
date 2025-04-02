import React, { useRef, useEffect } from 'react'


const Canvas = props => {
  const canvasRef = useRef(null);
  const newProps = { ...props, diseases: "true" };

  const drawPolygon = (points, ctx, canvas) => {
    const margin = 5;
    let minX, minY, maxX, maxY;

    ctx.fillStyle = '#008eff50';
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#008eff';

    points.forEach((p, i) => {
      if (i === 0) { // if first point
        minX = maxX = p[0]; // x is longitude
        minY = maxY = p[1]; // y is latitude
      } else {
        minX = Math.min(p[0], minX);
        minY = Math.min(p[1], minY);
        maxX = Math.max(p[0], maxX);
        maxY = Math.max(p[1], maxY);
      }
    });

    // now get the map width and height in its local coords
    const mapWidth = (maxX - minX);
    const mapHeight = (maxY - minY);

    // to find the scale that will fit the canvas get the min scale to fit height or width
    const scale = Math.min((canvas.width - 2 * margin) / mapWidth, (canvas.height - 2 * margin) / mapHeight);

    // Calculate offsets to center the polygon in the canvas
    const offsetX = (canvas.width - mapWidth * scale) / 2;
    const offsetY = (canvas.height - mapHeight * scale) / 2;

    // Now you can draw the map centered on the canvas
    let end;
    ctx.beginPath();
    if (points.length > 2) {
      points.forEach((p, i) => {
        let scaledX = (p[0] - minX) * scale + offsetX;
        let scaledY = (maxY - p[1]) * scale + offsetY;

        if (i === 0) {
          end = { x: scaledX, y: scaledY };
          ctx.moveTo(scaledX, scaledY);
        } else {
          ctx.lineTo(scaledX, scaledY);
        }
      });

      ctx.lineTo(end.x, end.y);
    } else {
      ctx.arc(canvas.width / 2, canvas.height / 2, 30, 0, 2 * Math.PI);
    }
    ctx.stroke();
    ctx.fill();
  };

  const drawGradient = (ctx, canvas) => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const grd = ctx.createLinearGradient(0, 0, 0, canvas.height - 20);
    grd.addColorStop(0, "#e80002");
    grd.addColorStop(2 / 3, "#efff0b");
    grd.addColorStop(1 / 2, "#f49c02");
    grd.addColorStop(1, "#7bfe66");
    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(25, 10, canvas.width - 35, canvas.height - 20);

    //Numbers
    const spacing = (canvas.height - 20) / 5;
    ctx.font = "13px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("25", 5, 15);
    for (let x = 1; x < 6; x++) {
      ctx.fillText((25 - (5 * x)).toString(), 5, (spacing * x) + 4);
    }
  }

  const getFillColor = (className) => {
    switch (className) {
      case "ALTA":
        return '#ff0000';
      case "MEDIA":
        return '#ff7200';
      case "BAIXA":
        return '#ffff00';
      case "NAN":
        return '#007eff';
      default:
        return "white";
    }
  }

  const drawDiseaseGradient = (ctx, canvas) => {
    if (props.evaluation.length > 0) {
      let ret = [];

      ret[0] = props.evaluation.find((val) => {
        return val.class === "ALTA"
      })
      ret[1] = props.evaluation.find((val) => {
        return val.class === "MEDIA"
      })
      ret[2] = props.evaluation.find((val) => {
        return val.class === "BAIXA"
      })
      ret[3] = props.evaluation.find((val) => {
        return val.class === "NAN"
      })

      ret = ret.filter((obj) => {
        return obj.value > 0;
      });

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const dados = ret;

      const totalValue = dados.reduce((total, item) => total + item.value, 0);

      let yOffset = 0;

      // Desenha a barra de gradiente
      dados.forEach(item => {
        const height = (item.value / totalValue) * canvas.height;

        ctx.fillStyle = getFillColor(item.class);
        ctx.fillRect(0, yOffset, canvas.width, height);

        // Adicione um rótulo
        ctx.fillStyle = "black";
        ctx.fillText(item.class, 10, yOffset + height / 2);

        yOffset += height;
      });
    }
  }

  // TODO: remover quando usar somente a drawAdvancedGradientBar()
  const drawGradientBar = (context, canvas, g, meta) => {
    canvas.width = 320;
    canvas.height = 20;

    let objectsArray = g;
    const ctx = context;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

    const minLower = Math.min(...objectsArray.map(obj => obj.lower));
    const maxUpper = Math.max(...objectsArray.map(obj => obj.upper));

    objectsArray.forEach((obj) => {
      const normalizedLower = (obj.lower - minLower) / (maxUpper - minLower);

      gradient.addColorStop(normalizedLower, `rgba(${obj.r},${obj.g},${obj.b},1)`);
    });

    ctx.fillStyle = gradient;
    ctx.roundRect(0, 0, canvas.width, canvas.height, 4);
    ctx.fill();
    ctx.shadowColor = "black";
    ctx.shadowBlur = 3
    ctx.font = "12px Poppins";
    ctx.fillStyle = "#FFFFFF";

    let numValuesToPlot = 9; //Quantos valores do gradient serão plotados na barra
    if (numValuesToPlot > objectsArray.length) {
      numValuesToPlot = objectsArray.length
    }

    const interval = (maxUpper - minLower) / (numValuesToPlot - 1);
    const heightFactor = -5;

    for (let i = 0; i < numValuesToPlot; i++) {
      const lowerValue = Math.round(minLower + i * interval);
      const normalizedLower = (lowerValue - minLower) / (maxUpper - minLower);
      const x = normalizedLower * canvas.width;

      if (i === numValuesToPlot - 2) {
        const lastObj = objectsArray[objectsArray.length - 1];
        ctx.fillText(lastObj.upper.toString(), x, canvas.height + heightFactor);
      } else if (i === 0) {
        ctx.fillText(meta ? meta.ylegend : "Cº", x + 10, canvas.height + heightFactor);
      } else {
        ctx.fillText(lowerValue.toString(), x + 5, canvas.height + heightFactor);
      }
    }

  }

  const drawAdvancedGradientBar = (context, canvas) => {
    // RBG no formato (0-255, 0-255, 0-255, 0-1)
    canvas.width = 320;
    canvas.height = 20;

    let objectsArray = props.advancedGradient.gradient;
    const ctx = context;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

    const minValuelabel = Math.min(...objectsArray.map(obj => obj.value));
    const maxValuelabel = Math.max(...objectsArray.map(obj => obj.value));
    const minValueRGB = Math.min(...objectsArray.map(obj => obj.valueRGB));
    const maxValueRGB = Math.max(...objectsArray.map(obj => obj.valueRGB));

    objectsArray.forEach((obj) => {
      const normalizedLower = (obj.valueRGB - minValueRGB) / (maxValueRGB - minValueRGB);

      gradient.addColorStop(normalizedLower, `rgba(${obj.red},${obj.green},${obj.blue},${obj.alpha})`);
    });

    ctx.fillStyle = gradient;
    ctx.roundRect(0, 0, canvas.width, canvas.height, 4);
    ctx.fill();
    ctx.shadowColor = "black";
    ctx.shadowBlur = 4
    ctx.font = "12px Poppins";
    ctx.fillStyle = "#FFFFFF";

    let numValuesToPlot = 9; // Quantos valores do gradient serão plotados na barra
    if (numValuesToPlot > objectsArray.length) {
      numValuesToPlot = objectsArray.length
    }

    const intervalLabel = (maxValuelabel - minValuelabel) / (numValuesToPlot - 1);
    const intervalRGB = (maxValueRGB - minValueRGB) / (numValuesToPlot - 1);
    const heightFactor = -5;

    for (let i = 0; i < numValuesToPlot; i++) {
      const lowerValueLabel = minValuelabel + i * intervalLabel;
      const lowerValueRGB = Math.round(minValueRGB + i * intervalRGB);
      const normalizedLower = (lowerValueRGB - minValueRGB) / (maxValueRGB - minValueRGB);
      const x = normalizedLower * canvas.width;

      if (i === numValuesToPlot - 2) {
        const lastObj = objectsArray[objectsArray.length - 1];

        ctx.fillText(lastObj.value.toString(), x, canvas.height + heightFactor);
      } else if (i === 0) {
        ctx.fillText(props.advancedGradient.name || "-", x + 10, canvas.height + heightFactor);
      } else if (i === 1) {
        const firstObj = objectsArray[0];

        ctx.fillText(firstObj.value.toString(), x + 5, canvas.height + heightFactor);
      } else {
        ctx.fillText(lowerValueLabel.toFixed(2).toString(), x + 5, canvas.height + heightFactor);
      }
    }
  }

  const drawEvapoGradientBar = (context, canvas) => {
    // RBG no formato (0-255, 0-255, 0-255, 0-1)
    canvas.width = 320;
    canvas.height = 20;

    let objectsArray = props.evapoGradient.gradient;
    const ctx = context;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

    const minValuelabel = Math.min(...objectsArray.map(obj => obj.value));
    const maxValuelabel = Math.max(...objectsArray.map(obj => obj.value));
    const minValueRGB = Math.min(...objectsArray.map(obj => obj.valueRGB));
    const maxValueRGB = Math.max(...objectsArray.map(obj => obj.valueRGB));

    objectsArray.forEach((obj) => {
      const normalizedLower = (obj.valueRGB - minValueRGB) / (maxValueRGB - minValueRGB);

      gradient.addColorStop(normalizedLower, `rgba(${obj.red},${obj.green},${obj.blue},${obj.alpha})`);
    });

    ctx.fillStyle = gradient;
    ctx.roundRect(0, 0, canvas.width, canvas.height, 4);
    ctx.fill();
    ctx.shadowColor = "black";
    ctx.shadowBlur = 4
    ctx.font = "12px Poppins";
    ctx.fillStyle = "#FFFFFF";

    let numValuesToPlot = 9; // Quantos valores do gradient serão plotados na barra
    if (numValuesToPlot > objectsArray.length) {
      numValuesToPlot = objectsArray.length
    }

    const intervalLabel = (maxValuelabel - minValuelabel) / (numValuesToPlot - 1);
    const intervalRGB = (maxValueRGB - minValueRGB) / (numValuesToPlot - 1);
    const heightFactor = -5;

    for (let i = 0; i < numValuesToPlot; i++) {
      const lowerValueLabel = minValuelabel + i * intervalLabel;
      const lowerValueRGB = Math.round(minValueRGB + i * intervalRGB);
      const normalizedLower = (lowerValueRGB - minValueRGB) / (maxValueRGB - minValueRGB);
      const x = normalizedLower * canvas.width;

      if (i === numValuesToPlot - 2) {
        const lastObj = objectsArray[objectsArray.length - 1];

        ctx.fillText(lastObj.value.toString(), x, canvas.height + heightFactor);
      } else if (i === 0) {
        ctx.fillText(props.evapoGradient.name || "-", x + 10, canvas.height + heightFactor);
      } else if (i === 1) {
        const firstObj = objectsArray[0];

        ctx.fillText(firstObj.value.toString(), x + 5, canvas.height + heightFactor);
      } else {
        ctx.fillText(lowerValueLabel.toFixed(2).toString(), x + 5, canvas.height + heightFactor);
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (props.pts && props.pts.length > 0) {
      drawPolygon(props.pts, context, canvas);
    }

    if (props.barscale === 1) {
      drawGradient(context, canvas);
    }

    if (props.diseases) {
      drawDiseaseGradient(context, canvas);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (props.pts && props.pts.length > 0) {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      context.clearRect(0, 0, canvas.width, canvas.height);
      drawPolygon(props.pts, context, canvas);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.pts])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const gradient = props.gradient
    const meta = props.meta

    if (gradient) {
      drawGradientBar(context, canvas, gradient.gradient, meta);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.gradient, props.meta])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (props.advancedGradient) {
      drawAdvancedGradientBar(context, canvas);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.advancedGradient])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (props.evapoGradient) {
      drawEvapoGradientBar(context, canvas);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.evapoGradient])

  // TODO: remover se não usar para o spritesheet
  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext('2d');
  //   const image = new Image();

  //     image.src = props.src;
  //     image.onload = () => {
  //       // Limpa o canvas
  //       context.clearRect(0, 0, canvas.width, canvas.height);
  //       // Desenha a parte do spritesheet especificada (x, y, width, height)
  //       context.drawImage(image, props.x, props.y, props.width, props.height, 0, 0, props.width, props.height);

  //       // Aplica a cor
  //       context.globalCompositeOperation = 'source-in';
  //       context.fillStyle = props.color;
  //       context.fillRect(0, 0, props.width, props.height);
  //       context.globalCompositeOperation = 'source-over';
  //     }
  // }, [props.src, props.color, props.width, props.height, props.x, props.y]);

  return <canvas ref={canvasRef} {...newProps} />
}

export default Canvas