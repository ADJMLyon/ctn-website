import React from 'react';
import Request from 'superagent';
import Slider from 'react-slick';

class CarouselItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let carouselText = <div className="carouselText">
                          <h3>{this.props.title}</h3>
                          <p>{this.props.text}</p>
                        </div>;
    if (this.props.href) carouselText = <a href={this.props.href} style={{display: 'block'}} _target="blank"> 
                                          <div className="carouselText">
                                            <h3>{this.props.title}</h3>
                                            <p>{this.props.text}</p>
                                          </div></a>;
      
    return (
      <div style={{backgroundImage: 'url(' + this.props.image + ')'}} className="carouselItem">
        {!this.props.thumb ? carouselText : null}
      </div>
    );
  }
}
CarouselItem.defaultProps = {
  title: "Pas de news ici",
  text: "Pas de news ici",
  image: '/defaults/no_video.png',
};

class Carousel extends React.Component {
  constructor(props) {
    super(props);

    this.populate = this.populate.bind(this);
    this.state = props;

    if (typeof props.route !== 'undefined') this.populate(props.route);
  }

  populate(route) {
    Request.get(route).end((err, data) => {
      data = data.body;
      if (err) data = this.props.carouselList;
      this.setState({carouselList: data, fetched: true});
    });
  }

  render() {
    const settings = {
      customPaging: i => (
        <a><CarouselItem {...this.state.carouselList[i]} thumb={true} key={'thumb' + i} /></a>
      ),
      dots: true,
      dotsClass: 'slick-dots slick-thumb',
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: this.state.carouselList.length > 1,
      autoplaySpeed: 5000,
    };
    if (this.state.fetched)
      return (
        <div className="carouselContainer">
          <Slider {...settings}>
            {this.state.carouselList.map((el, i) => <div key={'item'+i}><CarouselItem {...el} /></div>)}
          </Slider>
        </div>
      );
    else
      return (
        <div className="carouselContainer">
          <div className="carouselItem">
            <div className="sk-folding-cube">
              <div className="sk-cube1 sk-cube" />
              <div className="sk-cube2 sk-cube" />
              <div className="sk-cube4 sk-cube" />
              <div className="sk-cube3 sk-cube" />
            </div>
          </div>
        </div>
      );
  }
}

Carousel.defaultProps = {
  carouselList: [
    {}
  ],
  fetched: false
};

export default Carousel;
