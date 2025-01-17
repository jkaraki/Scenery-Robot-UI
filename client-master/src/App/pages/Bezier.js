import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { COLORS } from '../../constants';
import { getDeviceType } from '../../helpers/responsive.helpers.js';

class Bezier extends React.PureComponent {
    constructor(props) {
      super(props);
  
      this.state = {
        // These are our 3 Bézier points, stored in state.
        startPoint: { x: 10, y: 10 },
        controlPoint: { x: 190, y: 100 },
        endPoint: { x: 10, y: 190 },
  
        // We keep track of which point is currently being
        // dragged. By default, no point is.
        draggingPointId: null,
      };
    }
  
    handleMouseDown(pointId) {
      this.setState({ draggingPointId: pointId });
    }
  
    handleMouseUp() {
      this.setState({ draggingPointId: null });
    }
  
    handleMouseMove({ clientX, clientY }) {
      const { viewBoxWidth, viewBoxHeight } = this.props;
      const { draggingPointId } = this.state;
  
      // If we're not currently dragging a point, this is
      // a no-op. Nothing needs to be done.
      if (!draggingPointId) {
        return;
      }
  
      // During render, we capture a reference to the SVG
      // we're drawing, and store it on the instance with
      // `this.node`.
      // If we were to `console.log(this.node)`, we'd see a
      // reference to the underlying HTML element.
      // eg. `<svg viewBox="0 0 250 250"
      const svgRect = this.node.getBoundingClientRect();
  
      /*
      Ok, this next bit requires some explanation.
  
      The SVG rect gives us the element's position relative
      to the viewport.
  
      The user's mouse position with `clientX` and `clientY`
      is also relative to the viewport.
  
      What we actually care about, though, is the cursor's
      position relative to the SVG itself.
  
      Let's use a diagram! Imagine if ⬁ is the user's cursor:
  
  
      ------------------------------------------------------
      | viewport            ______________                 |
      |                    |              |                |
      |                    |       ⬁      | <- SVG         |
      |                    |______________|                |
      |____________________________________________________|
  
      ^----------------------------^ This is the `clientX`;
                                     the distance between the
                                     viewport and the cursor.
  
      ^-------------------^          This is the `svgRect`
                                     `left` value. Distance
                                     between the viewport and
                                     the SVG's left edge.
  
                          ^--------^ This is the distance we
                                     care about; the distance
                                     between the SVG's left
                                     edge, and the cursor.
  
      We can get that value with subtraction!
      */
      const svgX = clientX - svgRect.left;
      const svgY = clientY - svgRect.top;
  
      /*
      The next problem is that our SVG has a different
      coordinate system: Our SVG's `viewBox` might be 250x250,
      while in terms of the screen real-estate it might
      actually take up 500x500 pixels!
  
      To solve for this, I used cross-multiplication. Here are
      the variables we need:
  
      - svgX            The value we just calculated. The
                        cursor's `x` position within the SVG.
  
      - viewBoxWidth    The width of the SVG's internal
                        coordinate system. Specified via
                        props to this component.
  
      - svgRect.width   The on-screen width of the DOM element
                        Returned from `getBoundingClientRect`.
  
      Armed with that data, we can cross-multiply as follows:
  
           svgX               viewBoxX (unknown)
      --------------    =    --------------------
       viewBoxWidth             svgRect.width
  
      The left side of this equation is in terms of the screen
      real-estate: our cursor might be 250px into a 500px-wide
      svg.
  
      The right side is the SVG's viewBox coordinate system.
      We're `X` pixels into a 250px-wide viewBox.
  
      When we re-arrange the formula to solve for `viewBoxX`,
      we wind up with:
      */
      const viewBoxX = svgX * viewBoxWidth / svgRect.width;
  
      // We do the same thing for the vertical direction:
      const viewBoxY = svgY * viewBoxHeight / svgRect.height;
  
      // Phew! That was a lot of stuff, but in the end we
      // wind up with the user's mouse position within the
      // SVG's viewBox, and can update React state so that it
      // re-renders in this new position!
      this.setState({
        [draggingPointId]: { x: viewBoxX, y: viewBoxY },
      });
    }
  
    render() {
      const { viewBoxWidth, viewBoxHeight } = this.props;
      const {
        startPoint,
        controlPoint,
        endPoint,
      } = this.state;
  
      // As we've seen before, the quadratic Bézier curve
      // involves moving to the starting point, and then
      // specifying the control and end points with `Q`
      const instructions = `
        M ${startPoint.x},${startPoint.y}
        Q ${controlPoint.x},${controlPoint.y}
          ${endPoint.x},${endPoint.y}
      `;
  
      // While the Bézier curve is the main attraction,
      // we also have several shapes, including:
      //   - the handles for the start/control/end points
      //   - the dashed line that shows how the control
      //     point connects to the start/end points.
      return (
        <svg
          ref={node => (this.node = node)}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          onMouseMove={ev => this.handleMouseMove(ev)}
          onMouseUp={() => this.handleMouseUp()}
          onMouseLeave={() => this.handleMouseUp()}
          style={{ overflow: 'visible' }}
        >
          <ConnectingLine
            from={startPoint}
            to={controlPoint}
          />
          <ConnectingLine from={controlPoint} to={endPoint} />
  
          <Curve instructions={instructions} />
  
          <LargeHandle
            coordinates={startPoint}
            onMouseDown={() =>
              this.handleMouseDown('startPoint')
            }
          />
  
          <LargeHandle
            coordinates={endPoint}
            onMouseDown={() =>
              this.handleMouseDown('endPoint')
            }
          />
  
          <SmallHandle
            coordinates={controlPoint}
            onMouseDown={() =>
              this.handleMouseDown('controlPoint')
            }
          />
        </svg>
      );
    }
  }
  
  // These helper stateless-functional-components allow us
  // to reuse styles, and give each shape a meaningful name.
  
  const ConnectingLine = ({ from, to }) => (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="rgb(200, 200, 200)"
      strokeDasharray="5,5"
      strokeWidth={2}
    />
  );
  
  const Curve = ({ instructions }) => (
    <path
      d={instructions}
      fill="none"
      stroke="rgb(213, 0, 249)"
      strokeWidth={5}
    />
  );
  
  const LargeHandle = ({ coordinates, onMouseDown }) => (
    <ellipse
      cx={coordinates.x}
      cy={coordinates.y}
      rx={15}
      ry={15}
      fill="rgb(244, 0, 137)"
      onMouseDown={onMouseDown}
      style={{ cursor: '-webkit-grab' }}
    />
  );
  
  const SmallHandle = ({ coordinates, onMouseDown }) => (
    <ellipse
      cx={coordinates.x}
      cy={coordinates.y}
      rx={8}
      ry={8}
      fill="rgb(255, 255, 255)"
      stroke="rgb(244, 0, 137)"
      strokeWidth={2}
      onMouseDown={onMouseDown}
      style={{ cursor: '-webkit-grab' }}
    />
  );
  
export default Bezier;