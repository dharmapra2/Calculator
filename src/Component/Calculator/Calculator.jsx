import React, { useRef, useEffect, useState } from "react";
import "./calculator.css";
import { btns, BTN_ACTIONS } from "./btnConfig";
export const Calculator = () => {
  const btnsRef = useRef(null);
  const expRef = useRef(null);
  const [expression, setExpression] = useState("");
  useEffect(() => {
    const btns = Array.from(btnsRef.current.querySelectorAll("button"));
    btns.forEach((e) => (e.style.height = e.offsetWidth + "px"));
  }, []);
  const ops = ["/", "x", "-", "+", "%", "+/-"];
  const btnClick = (item) => {
    let val = item.display;
    if (
      (ops.includes(val) && expression === "") ||
      (ops.includes(val) && ops.includes(expression.slice(-1)))
    ) {
      return;
    }
    // console.log(item);
    const expDiv = expRef.current;
    if (item.action === BTN_ACTIONS.PLM) {
      let res = eval(expression * -1);
      expDiv.innerHTML = "";
      setExpression(res.toString());
      addAnimation(res);
    }
    if (item.action === BTN_ACTIONS.ADD) {
      const oper = item.display !== "x" ? item.display : "*";
      setExpression(expression + oper);
      addAnimation(item.display);
    }
    if (item.action === BTN_ACTIONS.DELETE) {
      expDiv.parentNode.querySelector("div:last-child").innerHTML = "";
      expDiv.innerHTML = "";
      setExpression("");
    }
    if (item.action === BTN_ACTIONS.CALC) {
      // console.log(item.display);
      if (expression.trim().length <= 0) return;
      expDiv.parentNode.querySelector("div:last-child").remove();
      // alert('selected any');
      const cloneNode = expDiv.cloneNode(true);
      expDiv.parentNode.appendChild(cloneNode);
      const transform = `translateY(${
        (cloneNode.offsetHeight + 10) * -1 + "px"
      }) scale(0.4)`;
      try {
        let res = eval(expression);
        setExpression(res.toString());
        setTimeout(() => {
          cloneNode.style.transform = transform;
          expDiv.style.color = "var(--text-white)";
          expDiv.innerHTML = "";
          addAnimation(Math.floor(res * 100000000) / 100000000);
        }, 200);
      } catch {
        cloneNode.style.transform = transform;
        expDiv.innerHTML = "Syntx error...";
      } finally {
        console.log("Calculation Complete.");
      }
    }
  };

  const addAnimation = (content) => {
    const expDiv = expRef.current;
    const span = document.createElement("span");
    span.innerHTML = content;
    span.style.opacity = "1";
    span.style.color = "var(--cal-res-color)";
    expDiv.appendChild(span);
    const width = span.offsetWidth + "px";
    span.style.width = "0";
    setTimeout(() => {
      span.style.width = width;
    }, 100);
  };
  return (
    <div className="calculator">
      <div className="calculator__result">
        <div ref={expRef} className="calculator__result__exp"></div>
        <div className="calculator__result__exp res"></div>
      </div>
      <div ref={btnsRef} className="calculator__btns">
        {btns.map((item, index) => (
          <button
            key={index}
            className={item.class}
            onClick={() => btnClick(item)}
          >
            {item.display}
          </button>
        ))}
      </div>
    </div>
  );
};
