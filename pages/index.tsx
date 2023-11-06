import Layout from '../components/Layout';
import { ChangeEventHandler, useState, useRef } from 'react';
import styles from "./index.module.css";
import Image from 'next/image';

const timeStatus: string[] = [
  "時間がない！",
  "時間がちょっとしかない！",
  "ほとんど時間がない！",
  "やや時間が不足している！",
  "まだ少し時間がある！",
  "時間は中途半端にある！",
  "時間がまあまあある！",
  "比較的時間に余裕がある！",
  "時間がある！",
  "時間がたくさんある！",
  "時間がありすぎる！"
];

function get<T>(arr: T[], index: number, defaultValue: T): T {
  if (0 <= index && index < arr.length) {
    return arr[index];
  }
  return defaultValue;
}

const IndexPage = () => {
  const [value, setValue] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let width = 300;
  let height = 150;

  const canvasChange = (value: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const scale = window.devicePixelRatio;
    width = Math.floor(300 * scale);
    height = Math.floor(150 * scale);
    canvas.width = width * 5;
    canvas.height = height;
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textBaseline = "top";
    ctx.fillStyle = "#000000";
    ctx.font = "150px sans-selif";
    ctx.textAlign = 'left';
    let text = '時間時間時間時間時間時間時間時間時間';
    let measure = Math.floor(ctx.measureText(text).width * 2 / 9);
    ctx.fillText(text, 0, 25);
    ctx.fillStyle = "#FFFFFF";
    let x_pos = width * (value / (timeStatus.length - 1)) + measure;
    if (value == 10) {
      x_pos = canvas.width;
      measure = 0;
    }
    ctx.fillRect(0, 0, measure, canvas.height);
    ctx.fillRect(x_pos, 0, canvas.width, canvas.height);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e: any) => {
    let value = e.target.value;
    canvasChange(value);
    setValue(value);
  };

  const getTweetShareURL = () => {
    let href = 'https://twitter.com/intent/tweet?text=';
    href += get(timeStatus, value, timeStatus[timeStatus.length - 1]);
    href += ' %7C ';
    href += 'jikan-nai%0D%0A';
    href += '&url=https://jikan-nai.vercel.app/'
    return (
      <a href={href} target='_blank' rel="noopener noreferrer">
        <Image src='/logo-black.png' alt='X(旧Twitter)' width={15} height={15} />
      </a>
    );
  };

  return (
    <Layout title={get(timeStatus, value, timeStatus[timeStatus.length - 1]) + ' | jikan-nai'}>
      <div className={styles.page}>
        <div>
          <h1>{get(timeStatus, value, timeStatus[timeStatus.length - 1])}！</h1>
        </div>
        <div><canvas className={styles.canvas} ref={canvasRef} width={width} height={height}></canvas></div>
        <span className={styles.span}>時間メータ</span>
        <div>
          <form>
            ない<input type='range' className='slider' value={value} min="0" max="10" onChange={(e) => handleChange(e)} />ある
          </form>
        </div>
        <div>{getTweetShareURL()}</div>
      </div>
    </Layout>
  )
};

export default IndexPage;