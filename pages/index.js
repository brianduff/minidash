import Head from 'next/head';
import Clock from '../components/clock';
import Tile from '../components/tile';
import { NumberBox, DayCountNumberBox } from "../components/numberbox";

function Preamble() {
  return (
    <Head>
      <link rel="manifest" href="/static/manifest.json" />
      <link rel="stylesheet" href="/static/style.css" type="text/css" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link href="https://fonts.googleapis.com/css?family=Roboto:100,200,300,400" rel="stylesheet" />
      <title>I am a page</title>
    </Head>
  );
}

function Home() {
  return (
    <div>
      <Preamble />
      <Clock />
  
      <div className="gridContainer">
        <Tile><DayCountNumberBox since="2019-05-10" description="Daddy days without chips" /></Tile>
        <Tile><NumberBox number="25" description="Michael's gold coins" /></Tile>
        <Tile><NumberBox number="25" description="Caitlin's gold coins" /></Tile>
        <Tile>Hello</Tile>
      </div>
    </div>
  );  
}

export default Home;