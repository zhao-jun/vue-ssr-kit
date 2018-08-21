module.exports = async (ctx, renderer) => {
  const context = { url: ctx.path }

  const appString = await renderer.renderToString(context)

  await ctx.render('template', {
    appString,
    style: context.renderStyles(),
    scripts: context.renderScripts(),
    initalState: context.renderState()
  })
}
