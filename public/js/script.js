setTimeout(() => {
    const alerts = document.querySelectorAll(".alert")

    alerts.forEach(alert => {
      // adiciona transição suave
      alert.style.transition = "all 0.6s ease"

      // animação: desliza pra direita + fade
      alert.style.transform = "translateX(100px)"
      alert.style.opacity = "0"

      // remove depois da animação
      setTimeout(() => {
        alert.remove()
      }, 600)
    })
  }, 10000) // 15 segundos


document.querySelectorAll(".data-formatada").forEach(el => {
const data = new Date(el.innerText)
el.innerText = data.toLocaleDateString("pt-BR")
})
