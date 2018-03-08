import React from 'react';
import Carousel from 'nuka-carousel';


const PrevArrow = ({ previousSlide, slideCount, currentSlide, goToSlide }) => {
  const onClick = (e) => {
    e.stopPropagation();
    if (currentSlide === 0) {
      goToSlide(slideCount - 1);
    } else {
      previousSlide();
    }
  };

  return (
    <a onClick={onClick}>
      <i className="fa fa-arrow-circle-left fa-3x" />
    </a>
  );
};

PrevArrow.propTypes = {
  currentSlide: React.PropTypes.number.isRequired,
  goToSlide: React.PropTypes.func.isRequired,
  previousSlide: React.PropTypes.func.isRequired,
  slideCount: React.PropTypes.number.isRequired,
};

const NextArrow = ({ nextSlide, slideCount, currentSlide, goToSlide }) => {
  const onClick = (e) => {
    e.stopPropagation();
    if (slideCount - 1 === currentSlide) {
      goToSlide(0);
    } else {
      nextSlide();
    }
  };

  return (<a onClick={onClick}>
    <i className="fa fa-arrow-circle-right fa-3x" />
  </a>);
};

NextArrow.propTypes = {
  currentSlide: React.PropTypes.number.isRequired,
  goToSlide: React.PropTypes.func.isRequired,
  nextSlide: React.PropTypes.func.isRequired,
  slideCount: React.PropTypes.number.isRequired,
};

const calcIndicatorCount = (maxIndicatorCount, slideCount) => (
  (maxIndicatorCount && slideCount > maxIndicatorCount && maxIndicatorCount) || slideCount
);

const selector = (maxIndicatorCount) => {
  const Component = ({ slideCount, goToSlide, currentSlide }) => (
    <ol className="selectors" onClick={(e) => e.stopPropagation()}>
      {
        (new Array(calcIndicatorCount(maxIndicatorCount, slideCount))).fill(true).map((empty, i) => (
          <li key={i}>
            <a onClick={() => goToSlide(i)} className={(currentSlide === i) ? 'active' : ''} />
          </li>
        ))
      }
    </ol>
  );

  Component.propTypes = {
    currentSlide: React.PropTypes.number.isRequired,
    goToSlide: React.PropTypes.func.isRequired,
    slideCount: React.PropTypes.number.isRequired,
  };
  return Component;
};

// These are the same as controls
const decorators = (maxIndicatorCount) => [{
  component: PrevArrow,
  position: 'CenterLeft',
}, {
  component: NextArrow,
  position: 'CenterRight',
}, {
  component: selector(maxIndicatorCount),
  position: 'BottomCenter',
}];

const CustomCarousel = ({ children, maxIndicatorCount }) => {
  const childCount = React.Children.count(children);
  return (
    <div className={`slider-wrapper ${!childCount ? 'empty' : ''}`}>
      <Carousel decorators={decorators(maxIndicatorCount)}>
        {children}
      </Carousel>
    </div>
  );
};

CustomCarousel.propTypes = {
  children: React.PropTypes.node.isRequired,
  maxIndicatorCount: React.PropTypes.number,
};

export default CustomCarousel;
