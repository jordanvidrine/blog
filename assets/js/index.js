let projects = document.getElementsByClassName('project')

  for (let count = 1; count <= projects.length; count++) {
    if (count%2 !== 0) {
      projects[count-1].className += ' odd';
    }
  }
