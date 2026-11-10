#import "SceneDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>

@implementation SceneDelegate

- (void)scene:(UIScene *)scene
    willConnectToSession:(UISceneSession *)session
                 options:(UISceneConnectionOptions *)connectionOptions
{
  if (![scene isKindOfClass:[UIWindowScene class]]) {
    return;
  }

  self.window = [[UIWindow alloc] initWithWindowScene:(UIWindowScene *)scene];

  // Registers the third-party native components found by codegen (New Architecture).
  self.dependencyProvider = [RCTAppDependencyProvider new];
  self.reactNativeFactory = [[RCTReactNativeFactory alloc] initWithDelegate:self];

  // Must match "name" in app.json, which index.js registers.
  [self.reactNativeFactory startReactNativeWithModuleName:@"SocialSanitation"
                                                 inWindow:self.window
                                        initialProperties:@{}
                                        connectionOptions:connectionOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

// In debug builds RCTBundleURLProvider finds Metro, including from a physical device
// through the ip.txt that the bundle script writes into the app.
- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
