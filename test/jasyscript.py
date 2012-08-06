
@task("Generate test")
def source():
    # Permutation independend config
    jsFormatting.enable("comma")
    jsFormatting.enable("semicolon")
    jsOptimization.disable("privates")
    jsOptimization.disable("variables")
    jsOptimization.disable("declarations")
    jsOptimization.disable("blocks")
    
    # Assets
    assetManager.addSourceProfile()
    
    # Store loader script
    includedByKernel = storeKernel("script/kernel.js")
    resolver = Resolver().addClassName("lowtest.Main").excludeClasses(includedByKernel)
    storeLoader(resolver.getSortedClasses(), "script/test.js", "")
    updateFile("source/index.html", "index.html")