import React from "react";

interface AnimatedProgressProviderProps {
  valueStart: number;
  valueEnd: number;
  duration: number;
  easingFunction: (t: number) => number;
  repeat?: boolean;
  children: (value: number) => React.ReactNode;
}

class AnimatedProgressProvider extends React.Component<AnimatedProgressProviderProps> {
  private animationId: number | null = null;
  private intervalId: number | null = null;
  private startTime: number = 0;
  private isAnimating: boolean = false;

  state = {
    value: this.props.valueStart,
    isAnimated: false
  };

  static defaultProps = {
    valueStart: 0
  };

  componentDidMount() {
    if (this.props.repeat) {
      this.intervalId = window.setInterval(() => {
        this.setState({
          isAnimated: !this.state.isAnimated
        });
        this.startAnimation();
      }, this.props.duration * 1000);
    } else {
      this.setState({
        isAnimated: true
      });
      this.startAnimation();
    }
  }

  componentWillUnmount() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startAnimation = () => {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.startTime = performance.now();
    this.animate();
  };

  animate = () => {
    const elapsed = performance.now() - this.startTime;
    const progress = Math.min(elapsed / (this.props.duration * 1000), 1);
    
    // Apply easing function
    const easedProgress = this.props.easingFunction(progress);
    
    // Calculate current value
    const startValue = this.state.isAnimated ? this.props.valueStart : this.props.valueEnd;
    const endValue = this.state.isAnimated ? this.props.valueEnd : this.props.valueStart;
    const currentValue = startValue + (endValue - startValue) * easedProgress;
    
    this.setState({ value: currentValue });
    
    if (progress < 1) {
      this.animationId = requestAnimationFrame(this.animate);
    } else {
      this.isAnimating = false;
    }
  };

  render() {
    return this.props.children(this.state.value);
  }
}

export default AnimatedProgressProvider;
