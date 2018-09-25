import React, { Component } from 'react';

export class Clock extends Component {
    constructor(props) {
      super(props);
      this.state = {
        init: new Date(),
        time: new Date(),
        diff: undefined
      }
    }
    
    componentDidMount() {
      this.timer = setInterval(this.tock, 1000)
      this.setState({
        diff: Math.round((this.state.time - this.state.init)/1000)
      })    
    }
    
    componentWillUnmount() {
      clearInterval(this.timer)
    }
    
    tock = () => {
      const now = new Date()
      this.setState({
        time: now,
        diff: Math.round((now - this.state.init)/1000)
      })
    }
    
    render() {
      return (
        <div id="app-clock">
          {this.state.time.toLocaleTimeString()}<br/>
          {this.state.diff} seconds have elapsed.
        </div>
      )
    }
  }


  
export class Weather extends Component {
    constructor(props) {
        super(props);
        this.state = {
        zip: "",
        temp: undefined,
        msg: "What's the weather in your neck of the woods?"
        }
        this._api = '2b3d81bef22fc8bc1a64b10bd1735d9a'
        
    }
        
    handleZip = (e) => {
        this.setState({zip: e.target.value})
    }

    isZip = () => {
        return (!isNaN(+this.state.zip) && this.state.zip.length === 5)
    }

    handleSubmit = (e) => {
        if(this.isZip()) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${this.state.zip}&units=imperial&appid=${this._api}`).then(
        response => response.json()).then(
        json => this.setState({
            temp: json.main.temp,
            msg: `The temperature in ${json.name} (${json.sys.country}) is ${parseInt(json.main.temp, 10)}F degrees. The condition is ${json.weather[0].main}: ${json.weather[0].description}.`
        }));
        } else {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.state.zip.split(" ").join(",")}&units=imperial&appid=${this._api}`).then(
        response => response.json()).then(
        json => this.setState({
            temp: json.main.temp,
            msg: `The temperature in ${json.name} (${json.sys.country}) is ${parseInt(json.main.temp, 10)}F degrees. The condition is ${json.weather[0].main}: ${json.weather[0].description}.`
        }));
        }
        if(e){
        e.preventDefault()
        }
    }

    render() {
        const styles = {
            button:{
                color: "white",
                backgroundColor: "grey",
                padding: "3px",
                margin: "3px",
                fontSize: "15px"
            }
        }
        return (
        <div id="app-weather">
            <form onSubmit={this.handleSubmit}>
            <label>
                ZIP:
                <input
                type="text"
                defaultValue={this.state.zip}
                onChange={this.handleZip}/>
            </label>
            <button style={styles.button} onClick={this.handleSubmit}>Search</button>
            </form>
            <div>{this.state.msg}</div>
        </div>
        )
    }
}



export class NewsPop extends Component {
    render() {
        const styles = {
            popBackground : {
                position: "fixed",
                width: "100%",
                height: "100%",
                top: "0",
                bottom: "0",
                left: "0",
                right: "0",
                margin: "auto",
                backgroundColor: "rgba(0,0,0, 0.5)"
            },
            popUp : {
                color: "white",
                fontSize: "14px",
                border: "solid white 2px",
                position: "absolute",
                left: "25%",
                right: "25%",
                top: "25%",
                backgroundColor: "grey",
                padding: "10px",
                opacity: "1",
                transition: "opacity 1s"
            }
        }
        const article = this.props.article[parseInt(this.props.value, 10)];
        return (
            <div id="app-newsPop" styles={styles.popBackground}>
                <div style={styles.popUp}>
                    <div style={{textAlign:"right"}}><a href onClick={this.props.toggle}>(close)</a></div>
                    <h1>{article.title}</h1>
                    <p>{article.source.name} {article.author ? "-" : null} {article.author}</p>
                    <div>{article.content}</div>
                </div>
            </div>
        )
    }
}



export class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            source: "sources=cnn",
            popUp: false,
            popArt: 0,
            articlesJson: undefined,
            articles: [],
            status: "",
            error: "",
            time: undefined};
        this._api = "81fe8bbe33f64b949474bf94cd180dab";
        this.topOfNews = React.createRef()
    }

    handleSourceChange = (e) => {
        this.setState({source: e.target.value});
    }

    fetchArticles = () => {
        this.setState({visibie: false, articles:"", status: "", error: ""})
        fetch(`https://newsapi.org/v2/top-headlines?${this.state.source}&apiKey=${this._api}`).then(
            response => response.json()).then(
                json => this.parseArticles(json)
            )
    }
    parseArticles = (json) => {
        const styles = {
            main:{
                fontSize: "20px",
                width: "450px",
                border: "solid white 2px",
                margin: "10px",
                padding: "10px",
                textAlign: "center"
            },
            description:{
                fontSize: "15px",
                fontStyle: "italic",
                textAlign: "left"
            },
            button:{
                color: "white",
                backgroundColor: "gray",
                margin: "1px",
            }
        }
        if (json.status === "ok") {
            const articleList = json.articles.map((item,index)=>
                <div id={"article_"+index} style={styles.main}>
                    <h4><a href={item.url} target="_blank">{item.title}</a></h4>
                    {item.urlToImage? <img
                        style={styles} 
                        src={item.urlToImage}
                        width="300px"
                        alt={item.url}/> : null }
                    <div style={styles.description}>{item.source.name}{item.description? " - " : null}{item.description}
                        <button style={styles.button} value={index} onClick={this.setArticle}>(read article)</button></div>
                    <div style={{fontSize:"10px", textAlign:"right"}}>Published: {new Date(item.publishedAt).toLocaleString()}</div>
                </div>
                );
            articleList.unshift(
                <div ref={this.topOfNews}>topOfNews</div>
            )
            this.setState({articlesJson: json.articles, visibie: true, articles: articleList, status:json.status, time: new Date().toLocaleTimeString()});
        } else {
            this.setState({visible: true, status: json.status, error: json.message, time: new Date().toLocaleTimeString()})
        }
    }

    setArticle = (e) => {
        this.setState({popArt: e.target.value})
        this.togglePop()
    }
    togglePop = () => {
        this.setState({popUp: !this.state.popUp})
    }
    componentDidMount() {
        this.fetchArticles()
    }

    render() {
        const styles = {
            main: {
                height: "800px",
                transition: "height .5s"
            },
            mainInvis: {
                height: "0px",
                transition: "height .5s"
            },
            dropdown: {
                color: "white",
                backgroundColor: "grey",
                padding: "3px",
                margin: "3px",
                fontSize: "15px"
            },
            articles: {
                height: "730px",
                overflow: "scroll",
                overflowX: "hidden"
            }
        }
        const selector = (
            <div id="app-news">
                <select
                    style={styles.dropdown}
                    width="50px"
                    value={this.state.source}
                    onChange={this.handleSourceChange}>
                    <option value="country=us">Top US News</option>
                    <option value="sources=cnn">CNN (USA)</option>
                    <option value="sources=bbc-news">BBC (UK)</option>
                    <option value="sources=the-washington-post">Washington Post (USA)</option>
                    <option value="sources=espn">ESPN</option>
                    <option value="sources=broken-source">(broken source)</option>
                </select>
                <button
                    style={styles.dropdown}
                    onClick={this.fetchArticles}>Refresh</button>
                <div style={styles.dropdown}>Last refreshed: {this.state.time}</div>
            </div>
        )

        if (this.state.status === "ok"){
            const articles = this.state.articles;
            return (
                <div style={styles.main}>
                    {selector}
                    <div style={styles.articles}>{articles}</div>
                    {this.state.popUp?
                        <NewsPop article={this.state.articlesJson}
                                value={this.state.popArt}
                                toggle={this.togglePop.bind(this)}/> : null }
                </div>
            )
        } else if (this.state.status ==="error") {
            return (
                <div style={styles.main}>
                    {selector}
                    <div>An error has occurred: {this.state.error}</div>
                </div>
            )
        } else {
            return (
                <div style={styles.mainInvis}>
                    {selector}
                    <div>Fetching articles...</div>
                </div>
            )
        }
    }
}



export class NewsTick extends Component {
    constructor(props) {
        super(props);
        this.state = {
            started: false,
            timer: new Date(),
            articles: undefined,
            articleSize: undefined,
            articlePos: -1,
            displayedArticle: undefined,
            visible: true
        }
        this.refreshRate = 600; // in seconds
        this.tickRate = 10 // in seconds
        this._api = "81fe8bbe33f64b949474bf94cd180dab"
    }

    fetchArticles = () => {
        fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${this._api}`).then(
            response => response.json()).then(
                json => this.parseArticles(json)
            )
    }
    parseArticles = (json) => {
        if (json.status === "ok") {
            this.setState({
                timer: new Date(),
                articles: json.articles,
                articleSize: json.totalResults-1,
                articlePos: -1
            })
        } else {
            this.setState({
                articlePos: -1,
                displayedArticle: <div>Error: {json.message}</div>
            })
        }
    }
    tickArticles = () => {
        const time = new Date();
        const diff = (time - this.state.timer)/1000;
        const styles = {
            button: {
                color: "white",
                fontSize: "8px",
                backgroundColor: "gray",
                border: "none",
                margin: "1px",
            },
        }

        if ( diff >= this.refreshRate || !this.state.articleSize ) {
            this.fetchArticles()
        };
        const newPos = this.state.articlePos >= this.state.articleSize? 0 : this.state.articlePos+1;
        const article = this.state.articles[newPos];
        const ticker = (
            <div><a href={article.url} target="_blank">{article.title} - {article.source.name}</a>
            <button style={styles.button} onClick={this.handleReload}>reload</button></div>
        )
        this.setState({visible: true, displayedArticle: ticker, articlePos: newPos})
    }
    handleReload = () => {
        this.fetchArticles();
        this.tickArticles()
    }

    componentDidMount() {
        this.fetchArticles();
        this.timer = setInterval(this.tickArticles, this.tickRate*1000) // in ms(!!)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render() {
        const styles = {
            ticker: {
                fontSize: "15px",
                height: "45px",
                transition: "height 2s"
            },
        }
        return (
            <div id="app-newsTicker" style={styles.ticker}>
                <div>{this.state.displayedArticle?
                    this.state.displayedArticle : "Top US News ticker is starting.."}</div>
                
            </div>
        )
    }
}