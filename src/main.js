const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'FRIEND_PLAYER';

const heading = $('header h2')
const cdThumb = $('.cd__thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const playlist = $('.playlist');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const randomIcon = $('.fa-shuffle');
const repeatBtn = $('.btn-repeat');
const repeatIcon = $('.fa-arrow-rotate-right');
const playIcon = $('.fa-play');
const pauseIcon = $('.fa-pause');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(' PLAYER_STORAGE_KEY')) || {},
    songs: [
        {
            name: "An",
            artist: "Hà Anh Tuấn",
            songPath: "./asset/music/An.wav",
            image: "./asset/img/HAT_TruyenNgan.jpg"
        },
        {
            name: " Có Chàng Trai Viết Lên Cây",
            artist: "Hà Anh Tuấn",
            songPath: "./asset/music/Có Chàng Trai Viết Lên Cây.wav",
            image: "./asset/img/HAT_TruyenNgan.jpg"
        },
        {
            name: "Cô Gái Và Cây Dương Cầm ",
            artist: "Hà Anh Tuấn",
            songPath: "./asset/music/Cô Gái Và Cây Dương Cầm.wav",
            image: "./asset/img/HAT_TruyenNgan.jpg"
        },
        {
            name: "Khi Người Mình Yêu Khóc ",
            artist: "Hà Anh Tuấn, Phan Mạnh Quỳnh",
            songPath: "./asset/music/Khi Người Mình Yêu Khóc.wav",
            image: "./asset/img/HAT_TruyenNgan.jpg"
        },
        {
            name: "Ngày Chưa Giông Bão",
            artist: "Hà Anh Tuấn",
            songPath: "./asset/music/Ngày Chưa Giông Bão.wav",
            image: "./asset/img/HAT_TruyenNgan.jpg"
        },
        {
            name: "Nước Ngoài",
            artist: "Hà Anh Tuấn",
            songPath: "./asset/music/Nước Ngoài.wav",
            image: "./asset/img/HAT_TruyenNgan.jpg"
        },
        {
            name: "Thương Em",
            artist: "Hà Anh Tuấn",
            songPath: "./asset/music/Thương Em.wav",
            image: "./asset/img/HAT_TruyenNgan.jpg"
        },
        {
            name: "Xuân Thì",
            artist: "Hà Anh Tuấn",
            songPath: "./asset/music/Xuân Thì.wav",
            image: "./asset/img/HAT_TruyenNgan.jpg"
        }
    ],
    setConfig: (key, value) => {
        app.config[key] = value;
        localStorage.setItem('FRIEND_PLAYER',JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) =>
            `
                    <div class="song${index === this.currentIndex ? ' active' : ''}" data-index = ${index}>
                        <div class="thumb" style="background-image: url('${song.image}')"></div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.artist}</p>
                        </div>
                        <div class="option">
                            <i class="fa-solid fa-ellipsis"></i>
                            <ul class="option__menu">
                                <li class="option__item option__item--remove">Remove this song</li>
                            </ul>
                        </div>
                    </div>
                `
        );
        playlist.innerHTML = htmls.join('');
    },

    handleEvent: function () {
        const cdWidth = cd.offsetWidth

        //CD Animation
        const cdthumbAnimation = cdThumb.animate([
            { transform: 'rotate(360deg)' },
        ],{
            duration: 10000, //10s
            iterations: Infinity
            }
        )
        cdthumbAnimation.pause()

        //Phong to thu nho
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCDWidth = cdWidth - scrollTop
            cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0
            cd.style.opacity = newCDWidth/cdWidth + 'px'
        }

        //Click play
        playBtn.onclick = function () {
            if(app.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }
        // When song is played
        audio.onplay = function () {
            app.isPlaying = true
            player.classList.add('playing')
            pauseIcon.classList.add('active')
            playIcon.classList.remove('active')
            cdthumbAnimation.play()
        }
        //When song is paused
        audio.onpause = function () {
            app.isPlaying = false
            player.classList.remove('playing')
            pauseIcon.classList.remove('active')
            playIcon.classList.add('active')
            cdthumbAnimation.pause()
        }

        //When song is being seeked
        audio.ontimeupdate = function () {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // When song is fast-forwarded
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 *e.target.value
            audio.currentTime = seekTime
        }

        // Click next song button
        nextBtn.onclick = function () {
            if(app.isRandom)
                app.playRandomSong()
            else
                app.nextSong()

            audio.play()
            app.render()
            app.scrolltoActiveSong()
        }

        // Click prev song button
        prevBtn.onclick = function () {
            if (app.isRandom)
                app.playRandomSong()
            else
                app.prevSong()

            audio.play()
            app.render()
            app.scrolltoActiveSong()
        }

        //Click random song button
        randomBtn.onclick = function (e) {
            app.isRandom = !app.isRandom
            app.setConfig('isRandom', app.isRandom)
            randomBtn.classList.toggle('active', app.isRandom)
            randomIcon.classList.toggle('active', app.isRandom)
        }

        //When song is ended
        audio.onended = function (e) {
            if (app.isRepeat)
                audio.play()
            else
                nextBtn.click()
        }
        //When click repeat button
        repeatBtn.onclick = function () {
            app.isRepeat = !app.isRepeat
            app.setConfig('repeat', app.isRepeat)
            repeatBtn.classList.toggle('active', app.isRepeat)
            repeatIcon.classList.toggle('active', app.isRepeat)
        }
        //When click to playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            const optionNode = e.target.closest(".option");
            if (songNode || optionNode) {
                if (songNode && !optionNode) {
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }
            }
        }
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.songPath
    },

    nextSong: function () {
      this.currentIndex++
      if(this.currentIndex >= this.songs.length - 1) {
          this.currentIndex = 0
      }
      this.loadCurrentSong()
    },

    prevSong: function () {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrolltoActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        },300)

    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    start: function () {
        this.loadConfig()
        this.defineProperties()
        this.handleEvent()
        this.loadCurrentSong()
        this.render()
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    }
}
app.start()