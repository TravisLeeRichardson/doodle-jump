document.addEventListener('DOMContentLoaded', () => {
  // only load contents once. can also put script at the bottom of the file
  const grid = document.querySelector('.grid')
  const doodler = document.createElement('div')
  let doodlerLeftSpace = 50
  let startPoint = 150
  let doodlerBottomSpace = startPoint
  let isGameOver = false
  let platformCount = 5
  let platforms = []
  let upTimerId
  let downTimerId
  let isJumping = true
  let isGoingLeft = false
  let isGoingRight = false
  let leftTimerId
  let rightTimerId
  let score = 0

  function createDoodler () {
    grid.appendChild(doodler) //puts doodler into the grid div element
    doodler.classList.add('doodler')
    doodlerLeftSpace = platforms[0].left
    doodler.style.left = doodlerLeftSpace + 'px' //style allows us to move the doodler around
    doodler.style.bottom = doodlerBottomSpace + 'px'
  }

  class Platform {
    constructor (newPlatformBottom) {
      this.bottom = newPlatformBottom
      this.left = Math.random() * 315 // will return anything between 0 and 315
      this.visual = document.createElement('div') //each platform

      const visual = this.visual
      visual.classList.add('platform') //add css class platform to the class list for later styling in css.
      visual.style.left = this.left + 'px'
      visual.style.bottom = this.bottom + 'px'
      grid.appendChild(visual) //add the plat
    }
  }

  function createPlatforms () {
    for (let i = 0; i < platformCount; i++) {
      let platformGap = 600 / platformCount
      let newPlatformBottom = 100 + i * platformGap
      let newPlatform = new Platform(newPlatformBottom) //create new platform
      platforms.push(newPlatform)
      console.log(platforms)
    }
  }

  function movePlatforms () {
    if (doodlerBottomSpace > 200) {
      platforms.forEach(platform => {
        //can name any array element whatever you want
        platform.bottom -= 4 //move down by 4 pixels
        let visual = platform.visual
        visual.style.bottom = platform.bottom + 'px'

        //remove old platforms and generate new ones
        if (platform.bottom < 10) {
          let firstPlatform = platforms[0].visual
          firstPlatform.classList.remove('platform')
          platforms.shift() //get rid of the 1st item in array
          let newPlatform = new Platform(600)
          platforms.push(newPlatform)
          score++
        }
      })
    }
  }

  function gameOver () {
    isGameOver = true

    //remove all elements from the grid
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild)
    }
    grid.innerHTML = score
  }

  function fall () {
    clearInterval(upTimerId) //get rid of timer that we set earlier
    isJumping = false
    downTimerId = setInterval(function () {
      doodlerBottomSpace -= 5 //fall down by 5 pixels
      doodler.style.bottom = doodlerBottomSpace + 'px'
      if (doodlerBottomSpace <= 0) {
        gameOver()
      }
      platforms.forEach(platform => {
        if (
          doodlerBottomSpace >= platform.bottom &&
          doodlerBottomSpace <= platform.bottom + 15 &&
          doodlerLeftSpace + 60 >= platform.left &&
          doodlerLeftSpace <= platform.left + 85 &&
          !isJumping
        ) {
          console.log('landed')
          startPoint = doodlerBottomSpace
          jump()
        }
      })
    }, 30)
  }

  function jump () {
    clearInterval(downTimerId)
    isJumping = true
    upTimerId = setInterval(function () {
      //declare a function as a parameter to occur every 30 msec.
      doodlerBottomSpace += 20 //move up by 20 pixels
      doodler.style.bottom = doodlerBottomSpace + 'px' //so we can see it.
      if (doodlerBottomSpace > startPoint + 200) {
        fall()
      }
    }, 30)
  }

  function moveLeft () {
    if (isGoingRight) {
      clearInterval(rightTimerId)
      isGoingRight = false
    }
    isGoingLeft = true

    leftTimerId = setInterval(function () {
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 5
        doodler.style.left = doodlerLeftSpace + 'px' //so we can see it.
      } else {
        moveRight()
      }
    }, 20)
  }

  function moveRight () {
    if (isGoingLeft) {
      clearInterval(leftTimerId)
      isGoingLeft = false
    }
    isGoingLeft = false
    rightTimerId = setInterval(function () {
      if (doodlerLeftSpace <= 340) {
        //400-60
        doodlerLeftSpace += 5
        doodler.style.right = doodlerLeftSpace + 'px' //so we can see it.
      } else {
        moveLeft()
      }
    }, 20)
  }

  function moveStraight () {
    isGoingRight = false
    isGoingLeft = false
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
  }

  function control (e) {
    if (!isGameOver) {
      if (e.key === 'ArrowLeft') {
        moveLeft()
      } else if (e.key === 'ArrowRight') {
        moveRight()
      } else if (e.key === 'ArrowUp') {
        moveStraight()
      }
    }
  }

  function start () {
    if (!isGameOver) {
      createPlatforms()
      createDoodler()
      setInterval(movePlatforms, 30) //eveyr 30 msec move platforms down
      jump()
      document.addEventListener('keyup', control)
    }
  }

  //attach button later to start game
  start()
})
