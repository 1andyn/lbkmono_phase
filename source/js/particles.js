var width, height, bgbody, canvas, context, particles, animatebg = true, rotate = true;

(function() {

    var particle_count;

    /* Check Settings*/
    config_cookies();

    /* Function Logic */
    initialize_body();
    config_listeners();


    /* Checks if Cookies Exists, Creates them If Not */
    function config_cookies() {
        var cookie_rotate = $.cookie('rotate');
        var cookie_animate = $.cookie('animate');

        /* Check if Cookies exist, if so, update */
        if(cookie_rotate === null || cookie_rotate === undefined) {
            $.cookie('rotate', '1', {path: '/'});
        } else {
            if(cookie_rotate == 1) {
                rotate = true;
            } else {
                rotate = false;
            }
        }
        if(cookie_animate === null || cookie_animate === undefined) {
            $.cookie('animate', '1', {path: '/'});
        } else {
            if(cookie_animate == 1) {
                animatebg = true;
            } else {
                animatebg = false;
            }
        }

        /* Configure Image Resource */
        var image_ani = document.getElementById('animate');
        if(!animatebg) {
            image_ani.src = imgdir + "ani_on.png"
        } else {
            image_ani.src = imgdir + "ani_off.png"
        }
        var image_rota = document.getElementById('rotate');
        if(!rotate) {
            image_rota.src = imgdir + "rota_on.png"
        } else {
            image_rota.src = imgdir + "rota_off.png"
        }
    }

    /* Gets Window dimensions and sets the corresponding variables */
    function set_window_dimensions() {
        width = window.innerWidth;
        height = window.innerHeight;
    }

    /* Gets references to elements in Index File */
    function get_body_elements() {
        bgbody = document.getElementById('main-body');
        canvas = document.getElementById('draw-canvas');
    }

    /* Configures elements based on Window Dimensions */
    function configure_elements() {
        bgbody.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }

    /* Create Particles and Start Animation */
    function start_animation() {
        particles = [];
        particle_count = width*.2;
        for(var x = 0; x < particle_count; x++) {
            var c = new Particle();
            particles.push(c);
        }
        animate();
    }

    function initialize_body() {
        /* Get Dimensions of window and set Body Height */
        set_window_dimensions();
        get_body_elements();
        configure_elements();

        /* Get Context */
        context = canvas.getContext('2d');
        start_animation();
    }

    /* Create listeners for handling animation behavior when browser is manipulated */
    function config_listeners() {
        /* Scroll listener is only necessary if you don't want the particles scrolling with the BG indefinitely*/
        //window.addEventListener('scroll', detect_scroll);
        window.addEventListener('resize', detect_resize);
    }

    /* Stops animation when scrolling */
    function detect_scroll() {
        /* If it's already stopped don't change logic */
        if(!animatebg) return;
        if(document.body.scrollTop > height) {
            animatebg = false;
        } else {
            animatebg = true;
        }
    }

    /* Stops animation when Resizing Window */
    function detect_resize() {
        set_window_dimensions();
        configure_elements()
    }

    /* Animation Function */
    function animate() {
        if(animatebg) {
            context.clearRect(0,0,width,height);
            for(var i in particles) {
                particles[i].draw();
            }
        }
        requestAnimationFrame(animate);
    }

    /* Particle */
    function Particle() {
        var _this = this, angle = 0, rotate_rate;

        var min_alpha = .2,
            min_scale = .005,
            rand_offset = .4,
            rand_offset_s = .4,
            vel_offset = 4,
            height_offset = 100,
            tri_x_offset =  30,
            tri_y_offset = 30,
            decay_rate = 0.0025,
            rotate_rate_offset = .5;

        /* Constructor */
        (function() {
            _this.pos = {};
            initialize_particle();
        })();

        /* Values for Position of Particle, Opacity(Alpha) Size and Velocity that it Travels */
        function initialize_particle() {
            _this.pos.x = Math.random()*width;
            _this.pos.y = height+Math.random()*height_offset;
            _this.alpha = min_alpha+Math.random()*rand_offset;
            _this.scale = min_scale+Math.random()*rand_offset_s;
            _this.velocity = Math.random()*vel_offset;
            angle = Math.random();
            rotate_rate = Math.random()*rotate_rate_offset;
        }

        /* Function used to Draw Particle Shape */
        function draw_triangle() {
            context.beginPath();
            context.moveTo(_this.pos.x, _this.pos.y);
            context.lineTo(_this.pos.x + tri_x_offset*_this.scale, _this.pos.y - tri_y_offset*_this.scale);
            context.lineTo(_this.pos.x + 2*tri_x_offset*_this.scale, _this.pos.y);
            context.lineTo(_this.pos.x + tri_x_offset*_this.scale, _this.pos.y - tri_y_offset*_this.scale/2);
            context.closePath();
            fill_shape();
            context.restore();
        }

        /* Fill Shape */
        function fill_shape() {
            context.fillStyle = 'rgba(255,255,255,'+ _this.alpha+')';
            context.fill();
        }

        /* Function used to Rotate Triangle */
        function rotate_triangle() {
            context.save();
            angle+=(Math.PI/3)*rotate_rate;
            context.translate(_this.pos.x + tri_x_offset*_this.scale, _this.pos.y - tri_y_offset*_this.scale/2);
            context.rotate(angle);
            context.translate(-(_this.pos.x + tri_x_offset*_this.scale), - (_this.pos.y - tri_y_offset*_this.scale/2));
        }

        /* Draw Function */
        this.draw = function() {
            if(_this.alpha <= 0) {
                initialize_particle();
            }
            _this.pos.y -= _this.velocity;
            _this.alpha -= decay_rate;
            if(rotate) {
                rotate_triangle();
            }
            draw_triangle();
        };
    }

})();

/* Function call switches the Animation, if it is running it stops, if it is stopped it runs */
function toggle_animate() {
    var image = document.getElementById('animate');
    if(animatebg) {
        animatebg = false;
        image.src = imgdir + "ani_on.png"
        $.cookie('animate', '0', {path: '/'});
    } else {
        animatebg = true;
        image.src = imgdir + "ani_off.png"
        $.cookie('animate', '1', {path: '/'});
    }
}

/* Function call switches the Rotation, if it is rotating it stops, if it is stopped it rotates */
function toggle_rotate() {
    var image = document.getElementById('rotate');
    if(rotate) {
        rotate = false;
        image.src = imgdir + "rota_on.png"
        $.cookie('rotate', '0', {path: '/'});
    } else {
        rotate = true;
        image.src = imgdir + "rota_off.png"
        $.cookie('rotate', '1', {path: '/'});
    }
}