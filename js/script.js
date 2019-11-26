/* Prevent dropdown menu closing on click */
var drop = document.querySelector('.dropdown-menu')
drop.addEventListener('click', function(e) {
  e.stopPropagation();
})

/////////////////////////////////////////////////////////////////////////////////////////

/* Click a button and copy associated text to computer clipboard */
function copy_to_clipboard(type) {
  if (type === "gmail") {
    var element = document.querySelector("#copy_gmail")
    /* only HTMLInputElement has the select() function, so create a pseudo <input> */
    var pseudo = document.createElement('input')
    pseudo.setAttribute('value', element.textContent)
    pseudo.style = {left: '-9999px'}  // make sure it does not appear on the page

    document.body.appendChild(pseudo)  // add it to HTML
    pseudo.select()  // select all text in this HTMLInputElement object
    document.execCommand('copy')  // copy whatever is selected to clipboard
    document.body.removeChild(pseudo)  // remove it from HTML
  }
  else if (type === 'qq') {
    var element = document.querySelector("#copy_qq")

    /* only HTMLInputElement has the select() function, so create a pseudo <input> */
    var pseudo = document.createElement('input')
    pseudo.setAttribute('value', element.textContent)
    pseudo.style = {left: '-9999px'}  // make sure it does not appear on the page

    document.body.appendChild(pseudo)  // add it to HTML
    pseudo.select()  // select all text in this HTMLInputElement object
    document.execCommand('copy')  // copy whatever is selected to clipboard
    document.body.removeChild(pseudo)  // remove it from HTML
  }
  else {
    alert("Somehow copy was unsuccessful..")
  }
}

////////////////////////////////////////////////////////////////////////////////////////////

/* Use Bootstrap tooltip and change its text on click */
$(function () {  // initialize
  $('[data-toggle="tooltip"]').tooltip()
})

$(document).on('inserted.bs.tooltip', function(e) {  // make tooltip accept css customization
    var tooltip = $(e.target).data('bs.tooltip');
    $(tooltip.tip).addClass($(e.target).data('tooltip-custom-classes'));
});

$('.copy_button').click(function() {  // change text when clicked
        $(this).tooltip('hide');
        $(this).tooltip().attr('data-original-title', "Copied");
        $(this).tooltip('show');
})
$('.copy_button').hover(function() {  // change text back when rehover
        $(this).tooltip().attr('data-original-title', "Copy to clipboard");
})

///////////////////////////////////////////////////////////////////////////////////////////////

/* Change navbar color at scroll */
var navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
  // console.log(window.scrollY)
  if (window.scrollY > 80) navbar.style.backgroundColor = '#7a7e82';  // 100 is not a calculated number
  else navbar.style.backgroundColor = 'transparent';
});

///////////////////////////////////////////////////////////////////////////////////////////////

/* Colliding Balls */
// Prework
var window_width = $(window).width();
var window_height = $(window).height();
var box_size = window_height*0.65;  // px
var box_border_size = 0.005*box_size;  // px
var box_position = $('.maoarea').position();
var y_interior_top = box_position.top/window_height + box_border_size/window_height;  // [0, 1]
var y_interior_bot = box_position.top/window_height + 0.65 - box_border_size/window_height;  // [0, 1]
var x_interior_left = (window_width/2 - box_size/2 + box_border_size) / window_width;  // [0, 1]
var x_interior_right = (window_width/2 + box_size/2 - box_border_size) / window_width;  // [0, 1]
// console.log(y_interior_top, y_interior_bot, x_interior_left, x_interior_right)

document.documentElement.style.setProperty('--box-size', box_size+'px');
document.documentElement.style.setProperty('--box-border-size', box_border_size+'px');

var r_min = 1; var r_max = 1.5;
var rho_min = 1; var rho_max = 2;  // density


// Define ball objects
var Balls = {
  N: 50,  // # of points
  x: Array(), y: Array(),  // position
  vx: Array(), vy: Array(),  // velocity
  r: Array(), ro: Array(),  // radius and density
  ball_div: Array(),  // the html element representing balls
  event: Array(),  // priority queue storing potential collisions
  createCircleOfSix: function(n, r, xc, yc) {
    var R = Math.sin((n-2)*Math.PI/2/n) / Math.sin(2*Math.PI/n) * 2*r - r;
    for (k = 0; k < n; k++)  // there are n balls in circle
    {
      this.x.push(xc + (R+r)*Math.sin((2*k+1)*Math.PI/n));
      this.y.push(yc + (R+r)*Math.cos((2*k+1)*Math.PI/n));
    }
  },
  createBarOfSix: function(n, r, theta, xc, yc) {
    var R = Math.sin((n-2)*Math.PI/2/n) / Math.sin(2*Math.PI/n) * 2*r - r;
    x_start = xc + (R+r)*Math.sin((2*(7/8*n-1)+1)*Math.PI/n);
    y_start = yc + (R+r)*Math.cos((2*(7/8*n-1)+1)*Math.PI/n);
    for (i = 0; i < this.N-n; i++)  // there are N-n balls in bar
    {
      this.x.push(x_start + (i+1)*2*r*Math.cos(theta));
      this.y.push(Math.tan(theta)*(x_start + (i+1)*2*r*Math.cos(theta)) + y_start - Math.tan(theta)*x_start);
    }
  },
  createBalls: function() {
    this.createCircleOfSix(32, (r_max+r_min)/2, 50, 25);  // better n % 8 = 0
    this.createBarOfSix(32, (r_max+r_min)/2, 5/12*Math.PI, 50, 25);

    for (i = 0; i < this.N; i++)
    {
      this.vx.push(-0.5 + Math.random());  // negative = move to the left
      this.vy.push(-0.5 + Math.random());  // negative = move to the top
      this.r.push(r_min + Math.random() * r_max);
      this.ro.push(rho_min + Math.random() * rho_max);

      var temp = document.createElement('div');
      temp.innerHTML = "<div class='ball' id=b" + i + "></div>";
      document.querySelector('.maoarea').appendChild(temp);
      this.ball_div.push(document.querySelector('#b' + i));

      this.drawBall(i);
      this.ball_div[i].style.width = this.r[i]/100 * 2 * box_size + "px";  // this is diameter
      this.ball_div[i].style.height = this.r[i]/100 * 2 * box_size + "px";

      var color_r = 205/(rho_max+1-rho_min)*this.ro[i]+50-205/(rho_max+1-rho_min);
      var color_gb = 155/(rho_max+1-rho_min)*this.ro[i]+100-155/(rho_max+1-rho_min);
      this.ball_div[i].style.backgroundColor = "rgb(" + color_r + "," + color_gb + "," + color_gb + ")";
    }
  },
  drawBall: function(i) {
    // need to use the exact position (px) because typically screen width > screen height
    this.ball_div[i].style.left = this.x[i]/100*x_interior_right*window_width + (1-this.x[i]/100)*x_interior_left*window_width - this.r[i]/100*box_size + "px"; 
    this.ball_div[i].style.bottom = window_height - (this.y[i]/100*y_interior_top*window_height + (1-this.y[i]/100)*y_interior_bot*window_height + this.r[i]/100*box_size) + "px";  // the y-coordinate of maoarea is opposite to body's
  },
  timeToCollide: function(i1, i2) {
    if (i2 == null)
    {  // ball to wall
      if (this.vx[i1] < 0) {var tx = (box_border_size/window_width*100-this.x[i1]+this.r[i1]) / this.vx[i1]}  // move leftward
      else {var tx = ((1-box_border_size/window_width)*100-this.x[i1]-this.r[i1]) / this.vx[i1]}
      if (this.vy[i1] < 0) {var ty = (box_border_size/box_size*100-this.y[i1]+this.r[i1]) / this.vy[i1]}  // move downward
      else {var ty = ((1-box_border_size/box_size)*100-this.y[i1]-this.r[i1]) / this.vy[i1]}

      return Math.min(tx, ty)
    }
    else
    {  // ball to ball
      var x = this.x[i1] - this.x[i2];
      var y = this.y[i1] - this.y[i2];
      var vx = this.vx[i1] - this.vx[i2];
      var vy = this.vy[i1] - this.vy[i2];
      if (x*vx + y*vy > 0) {return Infinity}
      else if ((x*vx+y*vy)**2 - (vx**2+vy**2)*(x**2+y**2-(this.r[i1]+this.r[i2])**2) < 0) {return Infinity}
      else {return (-x*vx - y*vy - Math.sqrt((x*vx+y*vy)**2 - (vx**2+vy**2)*(x**2+y**2-(this.r[i1]+this.r[i2])**2))) / (vx**2+vy**2)}
    }
  },
  predictCollision: function(i1) {
    for (j = 0; j < this.N; j++)  // this shouldn't be i (overwrite moveBall loop)
    {
      if (j != i1)
      {
        this.event.push({
          time: this.timeToCollide(i1, j),
          ball1: i1,
          ball2: j,
        })
      }
    }
    this.event.push({  // collide with one of the four walls
      time: this.timeToCollide(i1, null),
      ball1: i1,
      ball2: null,
    })

    this.event.sort(function(a, b) {return a.time - b.time});
    this.event.length = 100;  // maintain array size (conider make a funtion of N)
  },
  moveBall: function() {
    for (i = 0; i < this.N; i++)
    {
      this.predictCollision(i);

      for (eve = 0; eve < this.event.length; eve++)
      {
        if (this.event[eve].time <= 0)
        {
          console.log("negative time!")
          console.log("this.event[eve].time: ", this.event[eve].time)
          console.log("this.x1", this.x[this.event[eve].ball1], "this.x2", this.x[this.event[eve].ball2])
          console.log("this.y1", this.y[this.event[eve].ball1], "this.y2", this.y[this.event[eve].ball2])
        }
        // somehow one frame corresponds to 1 unit time (reason unkown yet)
        // but not exactly, always have arround 10^-14 error, so 10^-10
        else if (this.event[eve].time < 1+Math.pow(10, -10))  // last chance(frame) to change
        {
          if (this.event[eve].ball2 == null)
          {
            this.vx[this.event[eve].ball1] *= -1;
            this.vy[this.event[eve].ball1] *= -1;
          }
          else  // no mass difference at this moment
          {
            var tempx = this.vx[this.event[eve].ball1];
            var tempy = this.vy[this.event[eve].ball1];
            var m1 = this.ro[this.event[eve].ball1] * (this.r[this.event[eve].ball1]**3);
            var m2 = this.ro[this.event[eve].ball2] * (this.r[this.event[eve].ball2]**3);
            this.vx[this.event[eve].ball1] = ((m1-m2)*tempx + 2*m2*this.vx[this.event[eve].ball2]) / (m1+m2);
            this.vy[this.event[eve].ball1] = ((m1-m2)*tempy + 2*m2*this.vy[this.event[eve].ball2]) / (m1+m2);
            this.vx[this.event[eve].ball2] = ((m2-m1)*this.vx[this.event[eve].ball2] + 2*m1*tempx) / (m1+m2);
            this.vy[this.event[eve].ball2] = ((m2-m1)*this.vy[this.event[eve].ball2] + 2*m1*tempy) / (m1+m2);
          }
        }
        else  // rest times(elements) indicate that there will be no collision
        {
          break;
        }
      }
      this.event.splice(0, eve);  // remove processed elements

      this.x[i] += this.vx[i];
      this.y[i] += this.vy[i];

      if (this.x[i] < 0) {this.x[i] = 5}
      if (this.x[i] > 100) {this.x[i] = 95}
      if (this.y[i] < 0) {this.y[i] = 5}
      if (this.y[i] > 100) {this.y[i] = 95}

      this.drawBall(i);
    }
  },
  clearBalls: function() {
    for (i = 0; i < this.N; i++)
    {
      this.ball_div[i].style.width = 0 + "px";
      this.ball_div[i].style.height = 0 + "px";
      this.drawBall(i);
    }
  }
}


// Define same ball objects for resetting
var CloneBalls = {
  N: 50,  // # of points
  x: Array(), y: Array(),  // position
  vx: Array(), vy: Array(),  // velocity
  r: Array(), ro: Array(),  // radius and density
  ball_div: Array(),  // the html element representing balls
  createCircleOfSix: function(n, r, xc, yc) {
    var R = Math.sin((n-2)*Math.PI/2/n) / Math.sin(2*Math.PI/n) * 2*r - r;
    for (k = 0; k < n; k++)  // there are n balls in circle
    {
      this.x.push(xc + (R+r)*Math.sin((2*k+1)*Math.PI/n));
      this.y.push(yc + (R+r)*Math.cos((2*k+1)*Math.PI/n));
    }
  },
  createBarOfSix: function(n, r, theta, xc, yc) {
    var R = Math.sin((n-2)*Math.PI/2/n) / Math.sin(2*Math.PI/n) * 2*r - r;
    x_start = xc + (R+r)*Math.sin((2*(7/8*n-1)+1)*Math.PI/n);
    y_start = yc + (R+r)*Math.cos((2*(7/8*n-1)+1)*Math.PI/n);
    for (i = 0; i < this.N-n; i++)  // there are N-n balls in bar
    {
      this.x.push(x_start + (i+1)*2*r*Math.cos(theta));
      this.y.push(Math.tan(theta)*(x_start + (i+1)*2*r*Math.cos(theta)) + y_start - Math.tan(theta)*x_start);
    }
  },
  createBalls: function() {
    this.createCircleOfSix(32, (r_max+r_min)/2, 50, 25);  // better n % 8 = 0
    this.createBarOfSix(32, (r_max+r_min)/2, 5/12*Math.PI, 50, 25);

    for (i = 0; i < this.N; i++)
    {
      this.vx.push(-0.5 + Math.random());  // negative = move to the left
      this.vy.push(-0.5 + Math.random());  // negative = move to the top
      this.r.push(r_min + Math.random() * r_max);
      this.ro.push(rho_min + Math.random() * rho_max);

      var temp = document.createElement('div');
      temp.innerHTML = "<div class='ball' id=clone_b" + i + "></div>";
      document.querySelector('.maoarea').appendChild(temp);
      this.ball_div.push(document.querySelector('#clone_b' + i));

      this.drawBall(i);
      this.ball_div[i].style.width = this.r[i]/100 * 2 * box_size + "px";  // this is diameter
      this.ball_div[i].style.height = this.r[i]/100 * 2 * box_size + "px";

      var color_r = 205/(rho_max+1-rho_min)*this.ro[i]+50-205/(rho_max+1-rho_min);
      var color_gb = 155/(rho_max+1-rho_min)*this.ro[i]+100-155/(rho_max+1-rho_min);
      this.ball_div[i].style.backgroundColor = "rgb(" + color_r + "," + color_gb + "," + color_gb + ")";
    }
  },
  drawBall: function(i) {
    // need to use the exact position (px) because typically screen width > screen height
    this.ball_div[i].style.left = this.x[i]/100*x_interior_right*window_width + (1-this.x[i]/100)*x_interior_left*window_width - this.r[i]/100*box_size + "px"; 
    this.ball_div[i].style.bottom = window_height - (this.y[i]/100*y_interior_top*window_height + (1-this.y[i]/100)*y_interior_bot*window_height + this.r[i]/100*box_size) + "px";  // the y-coordinate of maoarea is opposite to body's
  }
}


// Create ball objects
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

Balls.createBalls()
var k_frame = 0;
var interval = setInterval(frame, 50);
function frame()
{
  if (k_frame == 2000)
  {
    Balls.clearBalls()
    CloneBalls.createBalls()
    clearInterval(interval);
  }
  else
  {
    sleep(2000).then(() => {
      Balls.moveBall()
      k_frame++
    })
  }
}
